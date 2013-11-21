var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);


app.configure(function() {
        app.use(express.static(__dirname + '/app/'));
    });
    

io.sockets.on('connection', function(socket) {
	socket.on('postChat', function(data) {
		console.log('postChat');
		console.log(data.text);
		socket.broadcast.emit('onPostChat', data);
	});
	/*
	socket.on('subscribe', function(room) {
		console.log('joining room', room);
		socket.join(data.room);
	});
	
	socket.on('unsubscribe', function(room) {
		console.log('leaving room', room);
		socket.leave(data.room);
	});*/
});



server.listen(1337);

