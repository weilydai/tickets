var paypal = require('../lib/paypal');
var files = require('../lib/files');
var mail = require('../lib/mail');
var ticket = require('../lib/ticket');
var s3 = require('../lib/s3');

exports.post = function (req, res) {
  res.locals.session = req.session;

  var quantity = req.body.quantity;

  if (quantity < ticket.minQuantity || quantity > ticket.maxQuantity) {
    console.log('Invalid quantity');
    res.redirect('/');
    return;
  }

  if (ticket.setPending(quantity)) {
    paypal.createPayment(quantity, function (err, resp) {
      if (err) {
        req.flash('error', err);
        res.redirect('/');
      } else {
        var i, link = resp.links;
        for (i = 0; i < link.length; i++) {
          if (link[i].rel === 'approval_url') {
            req.session.payment_id = resp.id;
            req.session.quantity = quantity;
            req.session.amount = ticket.price * quantity;
            req.session.item = ticket.item;
            res.redirect(link[i].href);
            return;
          }
        }
      }
      req.flash('error', 'createPayment failed');
      res.redirect('/');
    });
  } else {
    req.flash('error', 'not enough stock left');
    res.redirect('/');
  }
};


exports.get = function (req, res) {
  res.locals.session = req.session;
  var payment_id = req.session.payment_id;
  var payer = {
    payer_id: req.query.PayerID
  };
  if (!req.session.payment_id || !req.query.PayerID) {
    res.render('failure', {
      'message': 'cannot find payment_id or payer_id'
    });
  } else {
    paypal.execute(payment_id, payer, function (err, resp) {
      if (err) {
        res.render('failure', {
          'message': 'failed to execute the order'
        });
        console.error('execute' + err);
      } else {
        console.log('========== order get ==========');
        s3.serve(req.session.quantity, function(attachments) {
            var options = {
                'to': 'zhangdongopq@hotmail.com',
                'attachments': attachments,
                'id': payment_id
            };
            
            mail.send(options);
        });
        // var options = {
        //   'to': 'zhangdongopq@hotmail.com',
        //   'attachments': s3.serve(req.session.quantity),
        //   'id': payment_id
        // };
        // console.log(options);

        // files.generateOutput(attachments, payment_id, function (err, filePath) {
        //   if (err) {
        //     req.flash('error', 'file generateOutput error');
        //     console.log(err);
        //     res.redirect('/error');
        //   } else {
            res.render('success', {
              'message': payment_id + ' payment succeed',
              'paymentId': payment_id,
              'item': req.session.item,
              'quantity': req.session.quantity,
              'amount': req.session.amount
            });
            // mail.send(options);
        //   }
        // });

        // files.sold(attachments);
      }
    });
  }
};
