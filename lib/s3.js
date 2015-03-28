// var s3 = require('s3');

// var client = s3.createClient({
// 	maxAsyncS3: 20, // default
// 	s3RetryCount: 20, // default
// 	s3RetryDeley: 1000, // default
// 	multipartUploadThreshold: 20971520, // default (20 MB) 
// 	multipartUploadSize: 15728640, // default (15 MB) 
// 	s3Options: {
// 		accessKeyId: 'AKIAJWITSAE6ZXNBAKEA',
// 		secretAccessKey: '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'
// 	}
// });

// var unsoldParams = {
// 	s3Params: {
// 		Bucket: 'frontpass-test',
// 		Prefix: 'unsold/'
// 	}
// };

// exports.listUnsold = function() {
// 	client.listObjects(unsoldParams, function(err, data) {
// 		if (err) {
// 			console.error(err, err.stack);
// 		} else {
// 			console.log('data', data);
// 		}
// 	});
// 	// var list = client.listObjects(unsoldParams);
// 	// list.on('error', function(err) {
// 	// 	console.error('unable to get the list: ', err.stack);
// 	// });
// 	// list.on('data', function(data) {
// 	// 	// console.log(data.Contents);
// 	// 	console.log('There are ' + (data.Contents.length - 1) + ' unsold tickets.');
// 	// });
// 	// list.on('end', function(data) {
// 	// 	console.log('=========== done listing ===========');
// 	// });
// }

// var maxNum;
// var findLimit = function(max) {
// 	var list = client.listObjects(unsoldParams);
// 	var unsolds = [];
// 	list.on('error', function(err) {
// 		console.error('unable to get unsold list: ' + err.stack);
// 	});
// 	list.on('data', function(data) {
// 		data.Contents.forEach(function(entry) {
// 			if (entry.Key !== 'unsold/') {
// 				unsolds.push(entry.Key.replace('.txt', '').replace('unsold/', ''));
// 			}
// 		});
// 		if (unsolds && unsolds.length > 0) {
// 			if (max) {
// 				maxNum = Math.max.apply(Math, unsolds);
// 				console.log(Math.max.apply(Math, unsolds));
// 				return Math.max.apply(Math, unsolds);
// 			} else {
// 				console.log(Math.min.apply(Math, unsolds))
// 				return Math.min.apply(Math, unsolds);
// 			}
// 		}
// 	});
// }

// exports.serve = function(length) {
// 	// var maxNum = findLimit(true);
// 	var minNum = findLimit(false);
// 	console.log(findLimit(true));
// 	console.log(findLimit(false));
// 	var attachments = [];
// 	for (var i = 0; i < length; i++) {
// 		var fileName = minNum + i;
// 		attachments.push({
// 			'path': fileName
// 		});
// 	}
// 	console.log(attachments);

// }

// // var params = {
// // 	localFile: 'files/unsold/3.txt',
// // 	s3Params: {
// // 		Bucket: 'frontpass-test',
// // 		Key: 'unsold/3.txt'
// // 	}
// // };
// // exports.listUnsold = function() {

// // 	var uploader = client.uploadFile(params);
// // 	uploader.on('error', function(err) {
// // 		console.error('unable to upload: ', err.stack);
// // 	});
// // 	uploader.on('progress', function() {
// // 		console.log('progress', uploader.progressMd5Amount,
// // 			uploader.progressAmount, uploader.progressTotal);
// // 	});
// // 	uploader.on('end', function() {
// // 		console.log('done uploading');
// // 	});
// // }

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

exports.listUnsold = function() {
	getUnsoldNum(function(data) {
		console.log(data.Contents.length - 1);
		console.log('========= Got Unsold =========');
	});
}

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
		console.log('files', files);
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

exports.serve = function(length) {
	var attachments = [];
	findLimit(false, function(minNum) {
		for (var i = 0; i < length; i++) {
			var fileName = minNum + i;
			attachments.push({
				'path': fileName
			});
		}
		console.log(attachments);
		return attachments;
	});
}