var paypal = require('../lib/paypal');
var files = require('../lib/files');

exports.post = function (req, res) {
  console.log('In download.post');
  if (req.body.paymentId) {
    files.getSold(req.body.paymentId, function (err, file) {
      if (err) {
        paypal.getPayment(req.body.paysmentId, function (err, payment) {
          if (err) {
            req.flash('error', err);
            res.redirect('/error');
          } else {
            paypal.extractQuantity(payment, function (err, quantity) {
              if (err) {
                req.flash('error', err);
                res.redirect('/error');
              } else {
                var results = files.serve(quantity);
                if (results) {
                  res.sendFile(results);
                } else {
                  req.flash('error', 'Cannot find enough ticket');
                  res.redirect('/error');
                }
              }
            });
          }
        });
      } else {
        res.sendFile(file);
      }
    });
  } else {
    req.flash('error', 'Erro: paymentId is missing');
    res.redirect('/error');
  }
};
