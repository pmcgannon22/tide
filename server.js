var express = require('express'),
	app = express(),
	fs = require('fs'),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

// Modulus.io for database host...?

var env = 'dev',
	config = require('./config/config')[env],
	mongoose = require('mongoose');

mongoose.connect(config.db);

var db = mongoose.connection;
var models_path = __dirname + '/app/models';

console.log(models_path);
console.log(config.db);

db.on('open', function() {
	console.log('Connected to database: ', config.db);
});

fs.readdirSync(models_path).forEach(function(file) {
	if(~file.indexOf('.js')) require(models_path + '/' + file)
});



db.on('error', console.error.bind(console, 'connection error:'));



app.configure(function() {
        app.use(express.static(__dirname + '/public/'));
        app.use(express.logger('dev')); //logs every request to the node console
        app.use(express.methodOverride()); // simulate DELETE and PUT
    });
    

io.sockets.on('connection', function(socket) {
	socket.on('postChat', function(data) {
		console.log('postChat');
		console.log(data.text);
		var Channel = mongoose.model('Channel');
		var msg = new Channel({
			name: 'first',
		});
		msg.messages.push({user:'Pat', content: 'First message ever.', msgtype: 'txt'});
		msg.save(function(err) {
			if(!err) console.log('Success!!');
		});
		socket.broadcast.emit('onPostChat', data);
	});
	
	
	
	/*
	Add to mongodb here?
	*/
});



server.listen(1337);
console.log("App listening on port 1337");

