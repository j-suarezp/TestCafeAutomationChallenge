import { Selector, t } from 'testcafe';
import AddDevicePage from './AddDevicePage';

class DevicesListPage {
    constructor() {
        this.url = 'http://localhost:3001/';

        this.devicesList = Selector('.list-devices .device-main-box');
        this.addDeviceButton = Selector('.submitButton');
        this.firstDeviceInList = this.devicesList.nth(0);
        this.lastDeviceInList = this.devicesList.nth(-1);
    }

    async goToAddDevicePage() {
        await t.click(this.addDeviceButton)
        return AddDevicePage;
    }

    async getFirstDeviceInListID() {
        const deviceEditLink = await this.firstDeviceInList.find('.device-edit').getAttribute('href');
        return deviceEditLink.split('/').pop();
    }

    async getLastDeviceInListID() {
        const deviceEditLink = await this.lastDeviceInList.find('.device-edit').getAttribute('href');
        return deviceEditLink.split('/').pop();
    }

  }
  
export default new DevicesListPage();
