var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendfile('index.html');
});


//Whenever someone connects this gets executed
io.on('connection', function(socket) {

    var clientAddress = socket.handshake.address;

    var socketId = socket.id;

    socket.on('authenticate', function(data) {
        var secret_key = data.secret_key;
        var channel = data.channel;

        if (secret_key == "8f4748711cb801ffe0e6cf76ff2d4f3d") {
            socket.auth = true;
            socket.emit('authenticate', true);
            console.log('A user authenticated. SocketId: ' + socketId);
        } else {
            socket.auth = false;
            socket.emit('authenticate', false);
            console.log('Client is not authorized. SocketId: ' + socketId);
        }
    });

    socket.on('joinChannel', function(channel) {
        socket.join(channel);
        socket.emit('joinChannel', 'Connected to ' + channel);
        console.log(channel);
    });

    socket.on('clientMessage', function(data) {
        var channel = Object.keys(socket.rooms).filter(item => item != socket.id);
        console.log(channel);
        if (socket.auth) {
            socket.in(channel).broadcast.emit('serverMessage', { message: data });
        }
    });

    setTimeout(function() {
        if (!socket.auth) {
            socket.disconnect();
        }
    }, 1000);

    socket.on('disconnect', function() {
        console.log('A user disconnected. SocketId: ' + socketId);
    });

});

http.listen(80, function() {
    console.log('listening on *:80');
});


// // sending to sender-client only
// socket.emit('message', "this is a test");

// // sending to all clients, include sender
// io.emit('message', "this is a test");

// // sending to all clients except sender
// socket.broadcast.emit('message', "this is a test");

// // sending to all clients in 'game' room(channel) except sender
// socket.broadcast.to('game').emit('message', 'nice game');

// // sending to all clients in 'game' room(channel), include sender
// io.in('game').emit('message', 'cool game');

// // sending to sender client, only if they are in 'game' room(channel)
// socket.to('game').emit('message', 'enjoy the game');

// // sending to all clients in namespace 'myNamespace', include sender
// io.of('myNamespace').emit('message', 'gg');

// // sending to individual socketid
// socket.broadcast.to(socketid).emit('message', 'for your eyes only');