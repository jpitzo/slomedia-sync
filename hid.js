// Interface to HID devices, will only care about 1st device!!

var HID = require('node-hid');
var util = require('util');
var events = require('events');
var _ = require('underscore');

var allDevices;
var currDevice = null;
var busy = false;

var linkedDevices = {};

function getAllDevices()
{
    if (!allDevices) {
	allDevices = HID.devices(5824,1159);
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
    if (currDevice === null) {
        currDevice = new HID.HID(hids[0].path);
    }

    this.hid = currDevice;
    this.position = 0;
    this.button = 0;
    this.hid.read(this.interpretData.bind(this));
    this.process = process;
}
util.inherits(Device, events.EventEmitter);

Device.prototype.interpretData = function(error, data) {
    var keypress;

    // Data will come as buffer object
    if(data && busy === false){
        data = data.toJSON()['data'];

        // Very basic check to see if the device gave us anything non zero. Keyups are registered as 0x00.
        // Should use something like hidstream if we wanted to get more clever
        keypress = _.reduce(data, function(memo, num){ return num !== 0 || memo}, false);

        if(keypress === true){
            busy = true;
            this.process.send({ action: 'keypress', data: {keypress: true} });
            setTimeout(function(){
                busy = false;
            }, 5000);
        }
    }

    this.hid.read(this.interpretData.bind(this));
}

exports.Device = Device;