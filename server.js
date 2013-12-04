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

app.configure(function() {
        app.use(express.logger('dev')); //logs every request to the node console
        app.use(express.methodOverride()); // simulate DELETE and PUT
        app.use(express.cookieParser());
        app.use(express.session({ secret: "This is a secret" }));
        app.use(app.router);
        app.use(function(req, res, next) {
			if(!req.session.username && req.path != '/login.html') {
				return res.redirect('/login.html');
			}
			next(); 
		});
        //Custom middleware to make sure the current session has a username attached to it. 
        app.use(express.static(__dirname + '/public/'));
});



//Routes - restful-ish
app.get('/data/:channel', channels.messages);
app.get('/register', function(req, res) {
	req.session.username = req.query.username;
	req.session.channel = req.query.channel;
	console.log(req.session);
	res.redirect('/');
});
app.get('/session-data/', function(req, res) {
	res.json(req.session);
});


/*
* Handle SocketIO stuff and saving the data received to Mongo.
*/


var Channel = mongoose.model('Channel');
var active_users = {};

io.sockets.on('connection', function(socket) {
	socket.on('postChat', function(data) {		
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
			{ new: true, upsert: true },
			function(err, doc) {
				if(!err) {
					io.sockets.in(doc.name).emit('onPostChat', { message: doc.messages[doc.messages.length-1], channel: doc.name });
				}
			}
		);
	});
	
	socket.on('subscribe', function(room) {
		console.log('joining room', room);
		socket.join(room);
	});	
		
	socket.on('unsubscribe', function(room) {
		console.log('leaving room', room);
		socket.leave(room);
	});
	
	socket.on('enter-channel', function(data) {
		if(active_users[data.channel]) {
			if(active_users[data.channel].indexOf(data.username) < 0)
				active_users[data.channel].push(data.username);
		} else {
			active_users[data.channel] = [data.username];
		}
		io.sockets.in(data.channel).emit('newActiveUser', {channel: data.channel, username: data.username});
		socket.emit('activeUserList', active_users[data.channel]);
	})
	
	socket.on('leave-channel', function(data) {
		if(active_users[data.channel]) {
			var index = active_users[data.channel].indexOf(data.username);
			if(index >= 0) active_users[data.channel].splice(index, 1);
			io.sockets.in(data.channel).emit('activeUserLeft',{channel: data.channel, username: data.username});
		}
	});
	
});



server.listen(1337);
console.log("App listening on port 1337");

