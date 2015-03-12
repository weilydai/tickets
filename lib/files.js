var fs = require('fs');
var path = require('path');
var config = require('./config');
var mail = require('../lib/mail');

function writeFile(name) {
  fs.writeFile(__dirname + '/../files/unsold/' + name + '.txt', 'Hey there!\nFile ' + name, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('The file ' + name + ' was saved!');
    }
  });
}

function soldList() {
  var files = fs.readdirSync(__dirname + '/../files/sold');
  console.log('Found ' + files.length + ' sold files');
  return files;
}

function unsold() {
  var list = [];
  var files = fs.readdirSync(__dirname + '/../files/unsold');
  for (var i in files) {
    list.push({
      name: files[i],
      email: '',
      date: '',
      sold: false
    });
  }
  console.log('Found ' + list.length + ' unsold files');
  return list;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function unsoldList() {
  var list = [];
  var files = fs.readdirSync(__dirname + '/../files/unsold');
  files.forEach(function(name){
    if (endsWith(name, 'txt')){
      list.push(name);
    }
  });
  console.log('Found ' + list.length + ' unsold files');
  return list;
}

function findLimit(max) {
  var files = fs.readdirSync(__dirname + '/../files/unsold');
  var list = [];
  files.forEach(function (file) {
      list.push(file.replace('.txt', ''));
    })
  if (list && list.length > 0) {
    if (max) {
      return Math.max.apply(Math, list);
    }
    return Math.min.apply(Math, list);
  }
  return -1;
}

exports.unsold = unsold;
exports.soldList = soldList;

exports.generate = function () {
  var list = unsold();
  var maxNum = findLimit(true);
  var minNum = findLimit(false);
  console.log('maxNum ' + maxNum);
  console.log('minNum ' + minNum);
  if (list.length < 20) {
    for (var i = maxNum + 1; i < maxNum + 11; i++) {
      writeFile(i);
    }
  }
};

exports.serve = function (length) {
  var maxNum = findLimit(true);
  var minNum = findLimit(false);
  var attachments = []
  for (var i = 0; i < length; i++) {
    var fileName = minNum + i;
    attachments.push({
      'path': path.join(__dirname, '/../files/unsold/', fileName + '.txt')
    });
  }
  return attachments;
};

exports.sold = function (attachments) {
  attachments.forEach(function (file) {
    var dest = file.path.replace('unsold', 'sold');
    fs.renameSync(file.path, dest, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('move ' + file.path + ' succeed');
      }
    });
  });
};

exports.generateOutput = function (attachments, paymentId, callback) {
  var buffer = [];
  attachments.forEach(function (file) {
    buffer.push(fs.readFileSync(file.path));
  });
  var filePath = path.join(__dirname, '/../files/sold/', paymentId + '.txt');
  fs.writeFile(filePath, buffer, function (err) {
    if (err) {
      callback && callback(err);
    } else {
      console.log('writeFile succeed ' + filePath);
      callback && callback(null, filePath);
    }
  });
};

exports.checkStock = function (quantity, callback) {
  var list = unsoldList();
  var length = list.length;
  if (length < config.stockWarning) {
    mail.stockWarning(length);
  }
  if (length >= quantity) {
    callback && callback(null);
  } else {
    callback && callback('unsold ' + list.length + ' is less than ' + quantity);
  }
};

exports.getSold = function (paymentId, callback) {
  var filePath = path.join(__dirname, '/../files/unsold/', fileName, '.txt');
  console.log('getSold ' + filePath);
  fs.exists(filePath, function (exists) {
    if (exists) {
      callback && callback(null, filePath);
    } else {
      callback && callback('file does not exist');
    }
  });
};
