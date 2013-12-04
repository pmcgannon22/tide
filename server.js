var express = require('express'),
	app = express(),
	fs = require('fs'),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
// Modulus.io for database host...?

//mongoose maps json to mongoDB
var env = 'dev',
	config = require('./config/config')[env],
	mongoose = require('mongoose');

mongoose.connect(config.db);

var db = mongoose.connection;
var models_path = __dirname + '/app/models';


db.on('open', function() {
	console.log('Connected to database: ', config.db);
});

fs.readdirSync(models_path).forEach(function(file) {
	if(~file.indexOf('.js')) require(models_path + '/' + file)
});



db.on('error', console.error.bind(console, 'connection error:'));

//loads channel controller
var channels = require('./app/controllers/channel');

//Routes - restful-ish
app.get('/data/:channel', channels.messages);

app.configure(function() {
		app.use(app.router);
        app.use(express.logger('dev')); //logs every request to the node console
        app.use(express.methodOverride()); // simulate DELETE and PUT
        app.use(express.static(__dirname + '/public/'));
});


var Channel = mongoose.model('Channel');

io.sockets.on('connection', function(socket) {
	socket.on('postChat', function(data) {
		console.log('postChat');
		console.log(data.text);
		
		//Adds the message to the current channel. 
		//If the channel doesn't exist, it will create it. 
		
		Channel.findOneAndUpdate({ name: data.channel.toLowerCase() },
			{
				$push: { 
					messages:{
						user: data.user,
						content: data.content,
						msgtype: 'txt'
					} 
				},
			},
			{ new: true, upsert: true, select: 'messages' },
			function(err, doc) {
				if(!err) {
					io.sockets.emit('onPostChat', doc.messages[doc.messages.length-1]);
				}
			}
		);
	});	
});



server.listen(1337);
console.log("App listening on port 1337");

