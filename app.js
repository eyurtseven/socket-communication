var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});


//Whenever someone connects this gets executed
io.on('connection', function(socket){

  var clientAddress = socket.handshake.address;

  var socketId = socket.id;

  console.log('A user connected. SocketId: ' + socketId); 

  socket.on('clientMessage', function(data){
    socket.broadcast.emit('serverMessage', {message: data});
  });

  socket.on('disconnect', function () {
    console.log('A user disconnected. SocketId: ' + socketId); 
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});