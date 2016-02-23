// Interface to HID devices

var HID = require('node-hid');
var util = require('util');
var events = require('events');

SUPPORTED_DEVICES = [
    [1917,1040]
];

var currdevice = null;

function getAllDevices()
{
    if (!allDevices) {
	allDevices = HID.devices();
    }
    return allDevices;
}

function Device(process)
{
    var hids = getAllDevices();
    if (!hids.length) {
        throw new Error("No devices could be found");
    }

    console.log(hids);

    // This can't be called twice or the second call will wonk out
    if (currdevice === null) {
        currdevice = new HID.HID(devices[0].path);
    }
    this.hid = currdevice;
    this.position = 0;
    this.button = 0;
    this.hid.read(this.interpretData.bind(this));
    this.process = process;
}
util.inherits(PowerMate, events.EventEmitter);

Device.prototype.interpretData = function(error, data) {
    console.log('got some data');
    console.log(data);
}

exports.Device = Device;