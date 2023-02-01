import DevicesListPage from '../page-objects/DevicesListPage';
import _ from 'lodash';
import AddDevicePage from '../page-objects/AddDevicePage';
import { getDevices, getDevice, editDevice, deleteDevice, createDevice } from '../utility/APIUtility';


fixture('Devices page tests')
    .page(DevicesListPage.url);

    test('Test 1: Validate devices UI against API', async t => {
        const expectedDevices = await getDevices();
        const expectedNumberOfDevices = expectedDevices.body.length;

        // 1. Validate the API call
        await t
            .expect(expectedDevices.status).eql(200, 'The API call did not return 200')
            .expect(expectedDevices.statusText).eql('OK', 'The API did not return OK as a status text')

        // 2. Validate # of selectors is equal to the number of elements in the reponse

        // 3. Build array with the UI data using the same structure that the API array
        let UIDevicesElementsData = [];
        for(let i = 0; i < expectedNumberOfDevices; i++) {
            const currentDeviceInfo = DevicesListPage.devicesList.child('.device-info').nth(i);
            const deviceName = await currentDeviceInfo.child('.device-name').innerText;
            const deviceType = await currentDeviceInfo.child('.device-type').innerText;
            const deviceCapacity = await (await currentDeviceInfo.child('.device-capacity').innerText).split(' ')[0];

            // Current device contains the EDIT and REMOVE buttons
            const currentDeviceOptions = DevicesListPage.devicesList.child('.device-options').nth(i);
            const deviceEdit = await currentDeviceOptions.child('.device-edit').getAttribute('href');
            const deviceRemove = currentDeviceOptions.child('.device-remove');

            // Assertion that validates that the remove button is present for the current element being evaluated
            await t.expect(deviceRemove.exists).ok('In the UI, the device # ' + i + ' does not have a remove button');

            // Saving current elemnt values in list
            UIDevicesElementsData.push({
                id: deviceEdit.split('/').pop(),
                system_name: deviceName,
                type: deviceType,
                hdd_capacity: deviceCapacity
            });
        }

        // 4. Validate that the items from the UI array exists in the API array
        const difference = _.intersectionWith(expectedDevices.body, UIDevicesElementsData, _.isEqual);
        await t.expect(difference.length).eql(expectedNumberOfDevices, 'The items showed in the UI are different that the ones that come from the API');
    });


    test('Test 2: Create a device and validate it got displayed properly', async t => {
        const addDevicePage = await DevicesListPage.goToAddDevicePage();
        await addDevicePage.createNewDevice('TEST DEVICE',AddDevicePage.typeEnum.WINDOWS_WORKSTATION, '100');

        
        const baseSelectorToValidate = DevicesListPage.devicesList.find('.device-info').withText('TEST DEVICE');

        await t
            .expect(baseSelectorToValidate.exists).ok()
            .expect(baseSelectorToValidate.innerText).contains('TEST DEVICE', 'Device name not showed as expected')
            .expect(baseSelectorToValidate.innerText).contains(AddDevicePage.typeEnum.WINDOWS_WORKSTATION, 'Device type not showed as expected')
            .expect(baseSelectorToValidate.innerText).contains('100', 'Device capacity not showed as expected');
        
        });


fixture('Edit device feature')
    .page(DevicesListPage.url)
    .beforeEach(async t  => {
        t.ctx.TEST_NEW_NAME = 'NEW TEST NAME';
        t.ctx.firstDeviceInListID = await DevicesListPage.getFirstDeviceInListID();
        t.ctx.deviceData = await getDevice(t.ctx.firstDeviceInListID).body;
        delete t.ctx.deviceData.id;
        t.ctx.initialName = t.ctx.deviceData.system_name;
        t.ctx.deviceData.system_name = t.ctx.TEST_NEW_NAME;
    })
    .afterEach(async t  => {
        t.ctx.deviceData.system_name = t.ctx.initialName;
        await t.expect(editDevice(t.ctx.firstDeviceInListID, t.ctx.deviceData).status).eql(200);
    });

    test('Test 3: Edit device name and validate is showed properly', async t => {
        await t
            .expect(editDevice(t.ctx.firstDeviceInListID, t.ctx.deviceData).status).eql(200)
            .navigateTo(DevicesListPage.url)
            .expect(DevicesListPage.firstDeviceInList.find('.device-name').innerText).eql(t.ctx.TEST_NEW_NAME);
    });


fixture('Delete device feature')
    .page(DevicesListPage.url)
    .beforeEach(async t  => {
        t.ctx.lastDeviceInListID = await DevicesListPage.getLastDeviceInListID();
        const deviceData = await getDevice(t.ctx.lastDeviceInListID).body;
        delete deviceData.id;
        t.ctx.deviceData = deviceData;
    })
    .afterEach(async t  => {
        await createDevice(t.ctx.deviceData);
    });


    test('Test 4: Delete device and validate is not present anymore in the DOM', async t => {
        await t
            .expect(deleteDevice(t.ctx.lastDeviceInListID).status).eql(200)
            .navigateTo(DevicesListPage.url)
            .expect(DevicesListPage.devicesList.find('.device-info').withText(t.ctx.deviceData.system_name).exists).notOk();
    });
