import { Selector, t } from 'testcafe';

class AddDevicePage {
    constructor() {
        this.url = 'http://localhost:3001/devices/add';

        this.systemNameInput = Selector('#system_name');
        this.typeDropdown = Selector('#type');
        this.hddCapacityInput = Selector('#hdd_capacity');
        this.saveButton = Selector('.submitButton');

        this.typeEnum = {
            WINDOWS_WORKSTATION: 'WINDOWS WORKSTATION',
            WINDOWS_SERVER: 'WINDOWS SERVER',
            MAC: 'MAC'
        }
    }

    async createNewDevice(name, type, capacity) {
        await t.typeText(this.systemNameInput, name);
        await t.click(this.typeDropdown).click(this.typeDropdown.withText(type));
        await t.typeText(this.hddCapacityInput, capacity);
        await t.click(this.saveButton);
    }

  }
  
export default new AddDevicePage();
