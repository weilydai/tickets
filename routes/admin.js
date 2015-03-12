var files = require('../lib/files');
var paypal = require('../lib/paypal');
var ticket = require('../lib/ticket');
var payments;
var refreshTime;

function refresh() {
  paypal.listPayment(5, 1, function (err, payment) {
    if (err) {
      console.log('listPayments err ' + err);
    } else {
      console.log('listPayments success');
      payments = payment.payments;
      refreshTime = new Date();
    }
  });
}

exports.get = function (req, res, next) {
  if (req.session.user) {
    console.log('render admin');
    res.render('admin', {
      'title': 'Admin',
      'unsold': ticket.unsoldList,
      'pending': ticket.pendingList,
      'sold': ticket.findSold(),
      'payments': payments,
      'refreshTime': refreshTime,
      'user': req.session.user,
      'success': req.flash('success').toString(),
      'error': req.flash('error').toString()
    });
  } else {
    req.flash('error', 'Please sign in for admin page');
    res.redirect('/login');
  }
};

exports.post = function (req, res, next) {
  var action = req.body.action;

  switch (action) {
  case 'refresh':
    refresh();
    break;
  default:
    break;
  }

  res.redirect('/admin');
};
