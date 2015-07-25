var paypal = require('paypal-rest-sdk');
var ticket = require('./ticket');

// paypal sandbox
// paypal.configure({
//   'mode': 'sandbox', //sandbox or live
//   'host': 'api.sandbox.paypal.com',
//   'client_id': 'AWwiAH-6_sxLtey1kdl9neYx-VknkJP8vhr83Y6RoMTPDa8n6O_6GiP9n-8WsvX2SdyNvHyR67e4fuL3',
//   'client_secret': 'EM9mcT5rp50H3mLJtR23wBHhol6SXQKu5BglwKoZ0WJmIK4V_-XJqbiHmWcm5V49fwpjEbuEBynQ7oe0'
// });

// paypal live
paypal.configure({
  'mode': 'live',
  'host': 'api.paypal.com',
  'client_id': 'AWDQvbl_bU2mzvwljw-_YQ0HdncacUSOiLPL_q3ByWmIcH2cYVhwEQY0sDUOaTr88snDNzs3Xu1Xkd0d',
  'client_secret': 'EMU0gpVWP24rCA0iS4pUqvUv4l_FrI1fj9x0vKxJcF692ttnuXf83uRmdiV1c8RFvEIliaonnNfqjSbK'
});

// exports.listPayment = function (count, offset, callback) {
//   var listPayment = {
//     'count': count,
//     'start_index': offset
//   };
//   paypal.payment.list(listPayment, function (error, payments) {
//     if (error) {
//       console.log(error);
//       callback && callback(error);
//     } else {
//       console.log("List Payments Response");
//       console.log(JSON.stringify(payments));
//       callback && callback(null, payments);
//     }
//   });
// };

// exports.extractQuantity = function (payment, callback) {
//   if (payment.state === 'approved' && payment.intent === 'sale' && payment.transactions && payment.transactions[0]) {
//     var transaction = payment.transactions[0];
//     if (transaction.item_list && transaction.item_list.items && transaction.item_list.items.quantity) {
//       var quantity = parseInt(transaction.item_list.items.quantity);
//       if (quantity > 0 && quantity < 8) {
//         callback && callback(null, quantity);
//         return;
//       }
//     }
//   }
//   callback && callback('extractPayment failed');
// };


// exports.getPayment = function (paymentId, callback) {
//   if (paymentId && paymentId.slice(0, 4) === 'PAY-') {
//     paypal.payment.get(paymentId, function (error, payment) {
//       if (error) {
//         console.error(error);
//         callback && callback('paymentId cannot be found');
//       } else {
//         console.log(payment);
//         // callback && callback(error);
//       }
//     });
//   } else {
//     callback && callback('paymentId invalid');
//   }
// };

exports.createPayment = function (quantity, callback) {

  var paypalPayment = {
    'intent': 'sale',
    'payer': {
      'payment_method': 'paypal'
    },
    'redirect_urls': {
      // url on localhost
      // 'return_url': 'http://localhost:3000/order',
      // 'cancel_url': 'http://localhost:3000/cancel'

      // url on heroku-dev
      // 'return_url': 'https://frontpass-dev.herokuapp.com/order',
      // 'cancel_url': 'https://frontpass-dev.herokuapp.com/cancel'

      // url on production
      'return_url': 'http://www.frontpass.net/order',
      'cancel_url': 'http://www.frontpass.net/cancel'
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