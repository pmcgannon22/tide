var aws = require('aws-sdk');
aws.config.update({
	accessKeyId:"AKIAITRFLUJSLVRLKX2Q",
	secretAccessKey:"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",
	region: "us-east-1"
});
var s3 = new aws.S3();

exports.upload = function(buf, headers) {
	var filename = "image-" + (new Date().getTime()) + "." + headers.extension;
	console.log(buf);
	s3.putObject({
		ACL: "public-read",
		ContentEncoding: headers.mime,
		Bucket: 'tide.ngrok',
		Key: filename,
		Body: buf
	},function(err, data) {
	});
	return filename;
}