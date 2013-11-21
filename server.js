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
});


server.listen(1337);

