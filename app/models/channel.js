var mongoose = require('mongoose'),
	config = require('../../config/config')['dev'],
	Schema = mongoose.Schema;

	
var MessageSchema = new Schema({
	user: {type: String, required: true},
	createdAt: {type: Date, default: Date.now},
	content: {type: String, default: ''}, //could be simple text, an image location, or a url.
	msgtype: {type: String, default: 'txt'} //txt,img,you
});

/******
Need to create some getters/setters/pre-methods that will do the processing on if something is an image, text, etc. 
******/
	
var ChannelSchema = new Schema({
	name: {type: String, required: true},
	createdAt: {type: Date, default: Date.now},
	messages: [MessageSchema]
});

