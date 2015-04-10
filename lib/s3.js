var sign = require('../lib/siggenerator');
var AWS = require('aws-sdk');
var AWS_ACCESS_KEY_ID = 'AKIAJWITSAE6ZXNBAKEA';
var AWS_SECRET_ACCESS_KEY = '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';
AWS.config.accessKeyId = AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = AWS_SECRET_ACCESS_KEY;

var s3 = new AWS.S3();
var unsoldParams = {
	Bucket: 'frontpass-test',
	Prefix: 'unsold/'
};

function getUnsoldNum(callback) {
	s3.listObjects(unsoldParams, function(err, data) {
		if (err) {
			console.error(err);
		} else {
			callback(data);
		}
	});
}

exports.getUnsoldNum = function(callback) {
	s3.listObjects(unsoldParams, function(err, data) {
		if (err) {
			console.error(err);
		} else {
			callback(data);
		}
	});
}

// exports.listUnsold = function(callback) {
// 	getUnsoldNum(function(data) {
// 		console.log(data.Contents.length - 1);
// 		console.log('========= Got Unsold =========');
// 	});
// }

function stripFile(max, callback) {
	var files = [];
	getUnsoldNum(function(data) {
		data.Contents.forEach(function(content) {
			if (content.Key !== ('unsold/')) {
				files.push(content.Key.replace('unsold/', '').replace('.txt', ''));
			}
		});
		callback(files);
	});
}

function findLimit(max, callback) {
	stripFile(max, function(files) {
		// console.log('files', files);
		if (files && files.length > 0) {
			if (max) {
				callback(Math.max.apply(Math, files));
			} else {
				callback(Math.min.apply(Math, files));
			}
		} else {
			callback(-1);
		}
	});
}

exports.serve = function(length, callback) {
	var attachments = [];
  	var expire = Date.parse(new Date()) / 1000 + 10000; // set expire time in seconds
	findLimit(false, function(minNum) {
		for (var i = 0; i < length; i++) {
			var fileName = minNum + i;
	      	var url = '/frontpass-test/unsold/' + fileName + '.txt';
	      	var signature = sign.generateSignature(url, expire, AWS_SECRET_ACCESS_KEY); // get signature
	      	var head = 'http://frontpass-test.s3.amazonaws.com/unsold/' + fileName + '.txt?AWSAccessKeyId=';
	      	var path = head + AWS_ACCESS_KEY_ID + '&Expires=' + expire + '&Signature=' + signature;
	      	// console.log(path);
			attachments.push({
				'filename': fileName + '.txt',
				'path': path
			});
		}
		// console.log(attachments);
		callback(attachments);
	});
}