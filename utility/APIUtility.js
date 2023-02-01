import { t } from 'testcafe';

function getDevices() {
    return t.request({
        url: 'http://localhost:3000/devices', 
        method: 'get'
    });
};

function getDevice(deviceID) {
    return t.request({
        url: 'http://localhost:3000/devices/' + deviceID, 
        method: 'get'
    });
}

function editDevice(deviceID, payload) { 
    return t.request({
        url: 'http://localhost:3000/devices/' + deviceID, 
        method: 'put', 
        body: payload
    });
};

function createDevice(payload) { 
    return t.request({
        url: 'http://localhost:3000/devices/', 
        method: 'post', 
        body: payload
    });
};

function deleteDevice(deviceID) { 
    return t.request({
        url: 'http://localhost:3000/devices/' + deviceID, 
        method: 'delete'
    });
};

export { getDevices, getDevice, editDevice, deleteDevice, createDevice };
