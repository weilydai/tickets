var paypal = require('paypal-rest-sdk');
var ticket = require('./ticket');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AUBapxQLJg1l5ysvFF-9pNWzHHc1mpsHYm8qL5D6NJQDm0gSju7MFdzMXN0eSsebUs0HwS2ut6O_fSZj',
  'client_secret': 'ELRT4B4Eggd23C5J7rsfp_qzutn18hE7dx0DpqIOxSD1ivmSsmys3PrjxwlfEhfAzHxbjbYUSbM-FMfV'
});

exports.listPayment = function (count, offset, callback) {
  var listPayment = {
    'count': count,
    'start_index': offset
  };
  paypal.payment.list(listPayment, function (error, payments) {
    if (error) {
      console.log(error);
      callback && callback(error);
    } else {
      console.log("List Payments Response");
      console.log(JSON.stringify(payments));
      callback && callback(null, payments);
    }
  });
};

exports.extractQuantity = function (payment, callback) {
  if (payment.state === 'approved' && payment.intent === 'sale' && payment.transactions && payment.transactions[0]) {
    var transaction = payment.transactions[0];
    if (transaction.item_list && transaction.item_list.items && transaction.item_list.items.quantity) {
      var quantity = parseInt(transaction.item_list.items.quantity);
      if (quantity > 0 && quantity < 8) {
        callback && callback(null, quantity);
        return;
      }
    }
  }
  callback && callback('extractPayment failed');
};


exports.getPayment = function (paymentId, callback) {
  if (paymentId && paymentId.slice(0, 4) === 'PAY-') {
    paypal.payment.get(paymentId, function (error, payment) {
      if (error) {
        console.error(error);
        callback && callback('paymentId cannot be found');
      } else {
        console.log(payment);
        // callback && callback(error);
      }
    });
  } else {
    callback && callback('paymentId invalid');
  }
};

exports.createPayment = function (quantity, callback) {

  var paypalPayment = {
    'intent': 'sale',
    'payer': {
      'payment_method': 'paypal'
    },
    'redirect_urls': {
      'return_url': 'http://localhost:3000/order',
      'cancel_url': 'http://localhost:3000/cancel'
    },
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

exports.execute = function(payment_id, payerid, callback) {
  paypal.payment.execute(payment_id, payerid, function(err, resp) {
    if (err) {
      console.log(err);
      callback && callback(error);
    } else {
      // console.log(resp);
      callback && callback(null, resp);
    }
  });
}