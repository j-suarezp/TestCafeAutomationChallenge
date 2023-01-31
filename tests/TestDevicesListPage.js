import DevicesListPage from '../page-objects/DevicesListPage';
import _ from 'lodash';

fixture('Devices page tests')
    .page(DevicesListPage.url);

test('Test 1: Validate devices UI against API', async t => {
    const expectedDevices = await DevicesListPage.getDevicesFromAPI();
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
