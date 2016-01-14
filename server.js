var express = require('express');
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

app.get('/sync/', function (req, res) {
  io.sockets.emit('sync');
  res.send('Yep');
});

server.listen(3001, function () {
  console.log('Example app listening on port 3001!');
})

io.on('connection', function(socket){
    // Setup powermate
    socket.emit('someone else connected');
    console.log('someone connected!');
})