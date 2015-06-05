var fs = require('fs');
var path = require('path');
var s3 = require('../lib/s3');

var ticket = {};

ticket.price = 10;
ticket.item = 'AMC e-ticket';
ticket.maxQuantity = 4;
ticket.minQuantity = 1;

var pendingNumber = 0;
var unsoldList = [];

ticket.pendingNumber = pendingNumber;
ticket.unsoldList = unsoldList;

ticket.initList = function () {
  // var files = fs.readdirSync(__dirname + '/../files/unsold');
    unsoldList = [];
    s3.getUnsoldNum(function(data) {
        data.Contents.splice(0, 1);
        unsoldList = data.Contents;
        //console.log('tickets data', unsoldList);
        console.log('Init with ' + data.Contents.length + ' unsold files');
        console.log('========= Got Unsold =========');
    });
};


ticket.setPending = function(quantity) {
  console.log(unsoldList.length);
  if (unsoldList.length - pendingNumber >= quantity) {
      pendingNumber += quantity;
      return true;
  } else {
      return false;
  }
};

ticket.removePending = function(quantity) {
    if (pendingNumber >= quantity) {
        pendingNumber -= quantity;
        //console.log('pendingNumber', pendingNumber);
        unsoldList = unsoldList.slice(quantity,unsoldList.length);
        return true;
    } else {
        return false;
    }
};

// ticket.confirmSold = function (quantity) {
//   if (pendingList.length > quantity) {
//     return true;
//   }
//   return false;

// };


module.exports = ticket;
