var sign = require('../lib/siggenerator');
var AWS = require('aws-sdk');
var async = require('async');
var schedule = require('node-schedule');

var config = require('./config');

// test for Q
var Q = require('q');

AWS.config.accessKeyId = config.AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = config.AWS_SECRET_ACCESS_KEY;

var s3 = new AWS.S3();
var unsoldParams = {
    Bucket: config.AWS_S3_NAME,
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

function stripFile(max, callback) {
    var files = [];
    getUnsoldNum(function(data) {
        data.Contents.forEach(function(content) {
            if (content.Key !== ('unsold/')) {
                files.push(content.Key.replace('unsold/', '').replace('.pdf', ''));
            }
        });
        callback(files);
    });
}

function findLimit(max, callback) {
    stripFile(max, function(files) {
        if (files && files.length > 0) {
            if (max) {
                callback(Math.max.apply(Math, files));
            } else {
                callback(initTrack);
            }
        } else {
            callback(-1);
        }
    });
}

function findMinFile(max) {
    stripFile(max, function(files) {
        if (max) {
            initTrack = Math.max.apply(Math, files);
        } else {
            initTrack = Math.min.apply(Math, files);
        }
    });
}

exports.serve = function(length, callback) {
    var attachments = [];
    var expire = Date.parse(new Date()) / 1000 + 10000; // set expire time in seconds
    findLimit(false, function(minNum) {
        for (var i = 0; i < length; i++) {
            var fileName = minNum + i;
            //Change to prod or test
            var url = '/frontpass-prod/unsold/' + fileName + '.pdf';
            var signature = sign.generateSignature(url, expire, AWS_SECRET_ACCESS_KEY); // get signature
            //Change to prod or test
            var head = 'http://frontpass-prod.s3.amazonaws.com/unsold/' + fileName + '.pdf?AWSAccessKeyId=';
            var path = head + AWS_ACCESS_KEY_ID + '&Expires=' + expire + '&Signature=' + signature;
            attachments.push({
                'filename': fileName + '.pdf',
                'path': path
            });
        }
        initTrack = initTrack + length;
        callback(attachments);
    });
}

exports.moveFile = function(files) {
    files.forEach(function(file) {
        var copyParams = {
            Bucket: 'frontpass-prod',
            CopySource: 'frontpass-prod/unsold/' + file.filename,
            Key: 'sold/' + file.filename
        };
        var deleteParam = {
            Bucket: 'frontpass-prod',
            Key: 'unsold/' + file.filename
        };
        var copyObject = function(copyParams) {
            var deferred = Q.defer();
            s3.copyObject(copyParams, deferred.resolve, function(err, data) {
                if (err) console.error(err);
                else return defered.promise;
            });
            return deferred.promise;
        };

        copyObject(copyParams)
            .then(function(res) {
                s3.deleteObject(deleteParam, function(err, data) {
                    if (err) console.error(err);
                    else {
                        console.log('deleted', data);
                    }
                });
            })
            .then(function(err) {
                if (err) console.log(err, err.stack);
            });
    });
}

//Initializing what is the minimum file name
var initTrack = 0;
findMinFile(false);
//Periodic initializing at 3 am every day what's the lowest file name
var initFileMinNumber = schedule.scheduleJob('0 3 * * *', findMinFile(false));
//End Initializtion