var paypal = require('paypal-rest-sdk');
var ticket = require('./ticket');
var config = require('./config');

// paypal init
paypal.configure(config.paypalConfig);

// create a paypal payment for future using
exports.createPayment = function (quantity, callback) {

  // paypal payment config
  var paypalPayment = {
    'intent': 'sale',
    'payer': {
      'payment_method': 'paypal'
    },
    'redirect_urls': config.paypalRedirectUrls,
    'transactions': [{
      'item_list': {
        'items': [{
          'name': ticket.item,
          'price': ticket.price,
          'currency': 'USD',
          'quantity': quantity
        }]
      },
      'amount': {
        'total': ticket.price * quantity,
        'currency': 'USD'
      },
      'description': 'This is the payment description.'
    }]
  };

  // create a paypal payment
  paypal.payment.create(paypalPayment, {}, function (err, resp) {
    if (err) {
      console.log(err);
      callback && callback(err);
    } else {
      // console.log(resp);
      callback && callback(null, resp);
    }
  });
};

// execute the payment
exports.execute = function(payment_id, payerid, callback) {
  paypal.payment.execute(payment_id, payerid, function(err, resp) {
    if (err) {
      console.log(err);
      callback && callback(error);
    } else {
      callback && callback(null, resp);
    }
  });
}