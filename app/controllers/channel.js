
var mongoose = require('mongoose'),
	Channel = mongoose.model('Channel');
	
exports.messages = function(req, res) {
	var returnData = {};
	Channel.findOne({ name: req.params.channel }).lean().exec(function(err, data) {
		if(!err) {
			res.json(data);
		} else {
			console.log("There was an error.");
		}
	});
};