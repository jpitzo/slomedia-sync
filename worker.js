var fs = require('fs');
var util = require('util');

process.on('exit', function () {
    process.send({action: 'dead', data: {}});
});

var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

console.log('forked process running');

process.on("disconnect", function () {
  // shutdown.
  console.log('shutting down');
  process.exit(0);
});

var hid = require('./hid');

var device = new hid.Device(process);