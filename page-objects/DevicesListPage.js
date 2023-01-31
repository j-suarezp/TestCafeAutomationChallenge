import { Selector, t } from 'testcafe';

class DevicesListPage {
    constructor() {
        this.url = 'http://localhost:3001/';

        this.endpoints = {
            getDevices: {url: 'http://localhost:3000/devices', method: 'get'}
        }

        this.devicesList = Selector('.list-devices .device-main-box');
    }

    async getDevicesFromAPI() {
        return t.request(this.endpoints.getDevices);
    }

  }
  
export default new DevicesListPage();
