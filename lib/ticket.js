var fs = require('fs');
var path = require('path');
// var Dropbox = require('dropbox');

var ticket = {};

ticket.price = 10;
ticket.item = 'AMC e-ticket';
ticket.maxQuantity = 4;
ticket.minQuantity = 1;

var pendingList = [];
var unsoldList = [];

ticket.pendingList = pendingList;
ticket.unsoldList = unsoldList;

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

ticket.initList = function () {
  var files = fs.readdirSync(__dirname + '/../files/unsold');
  unsoldList = [];
  pendingList = [];

  files.forEach(function (name) {
    if (endsWith(name, 'txt')) {
      unsoldList.push(name);
    }
  });
  console.log('Init with ' + unsoldList.length + ' unsold files');
};

ticket.findSold = function () {
  var files = fs.readdirSync(__dirname + '/../files/sold');
  console.log('Found ' + files.length + ' sold files');
  return files;
};

ticket.setPending = function (quantity) {
  if (unsoldList.length >= quantity) {
    pendingList = pendingList.concat(unsoldList.slice(0, quantity))
    return true;
  }
  return false;
};

ticket.removePending = function (quantity) {
  if (pendingList.length > quantity) {
    unsoldList = unsoldList.concat(pendingList.slice(0, quantity))
    return true;
  }
  return false;
};

ticket.confirmSold = function (quantity) {
  if (pendingList.length > quantity) {
    return true;
  }
  return false;

};


module.exports = ticket;
