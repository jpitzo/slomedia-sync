var express = require('express');
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

// setup child proc for keyboard/button input
wProc = require('child_process').fork('/data/sync/worker');

app.get('/sync/', function (req, res) {
  io.sockets.emit('sync');
  res.send('Yep');
});

server.listen(3001, function () {
  console.log('Sync server is listening on port 3001!');
})

// Socket management
var sockets = {};

io.on('connection', function(socket){
    sockets[socket.id] = socket;
});

wProc.on('message', function(msg){
    Object.keys(sockets).forEach(function(key) {
    if (sockets[key].connected) {
        sockets[key].emit(msg.action, msg.data);
    }
    else{
        // Remove socket
        delete sockets[key];
    }
  });
});