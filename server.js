var express = require('express'),
	app = express(),
	fs = require('fs'),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server, {
		'sync disconnect on unload': true
	});
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
var s3 = require('./app/controllers/aws');
var Channel = mongoose.model('Channel');
var active_users = {};

io.sockets.on('connection', function(socket) {
	socket.on('postChat', function(data) {		
		//Adds the message to the current channel. 
		//If the channel doesn't exist, it will create it.
		
		if(data.msgtype == 'img') {
			data = handleImage(data);
		}
		Channel.findOneAndUpdate({ name: data.channel.toLowerCase() },
			{
				$push: { 
					messages:{
						user: data.user,
						content: data.content,
						msgtype: data.msgtype
					} 
				},
			},
			{ new: true, upsert: true },
			function(err, doc) {
				console.log(doc);
				if(!err) {
					io.sockets.in(doc.name).emit('onPostChat', { message: doc.messages[doc.messages.length-1], channel: doc.name });
				}
			}
		);
	});
	
	/*
	Handles upload the image to S3 and returning the necessary metadata in the correct form. 
	*/
	var handleImage = function(data) {
		var mime = /data:(.+);/.exec(data.content)[1];
		var datatype = mime.split("/")[1];
		var buf = new Buffer(data.content.replace(/^data:image\/\w+;base64,/, ""),'base64');
		var headers = {
			mime:mime,
			extension:datatype
		};
		var imageUrl = "https://s3.amazonaws.com/tide.ngrok/" + s3.upload(buf, headers);
		return {
			user: data.user,
			channel: data.channel,
			content: imageUrl,
			msgtype: 'img'
		};
	}
	
	socket.on('subscribe', function(room) {
		console.log('joining room', room);
		socket.join(room);
	});	
		
	socket.on('unsubscribe', function(room) {
		console.log('leaving room', room);
		socket.leave(room);
	});
	
	/*
	enter-channel, leave-channel, and the disconnect handling are used to handle the management of the ActiveUserList for each channel on the client side. 
	They are different from unsubscribe and subscribe in the sense that they let the server know what is the currently displayed channel, while subscribe and unsubscribe
	tell the server all of the channels in the list, regardless of if they are active or not. 
	*/
	socket.on('enter-channel', function(data) {
		socket.set('currentChannel', data.channel, function() {});
		socket.set('username', data.username, function() {});
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
	
	//Handles when clients close window or navigate to another site.
	socket.on('disconnect', function() {
		socket.get('currentChannel', function(err, channel) {
			socket.get('username', function(err, name) {
				io.sockets.in(channel).emit('activeUserLeft', {channel: channel, username: name});
				console.log(name + ' disconnected, leaving channel ' + channel);
			});
		});
	});
	
});



server.listen(1337);
console.log("App listening on port 1337");

