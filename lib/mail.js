var nodemailer = require('nodemailer');
var config = require('./config');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  host: 'smtp.mandrillapp.com',
  port: 587,
  auth: {
    user: 'zhangdongopq@hotmail.com',
    pass: 'PJ-imYMZVGEKGnIrt5L7yA',
  }
});

exports.send = function (options, callback) {
  var mailOptions = {
    'from': config.email,
    'to': options.to,
    'subject': '✔ Ticket Express sales: ' + options.id,
    'text': 'Thanks for shopping at FrontPass!\nYour ticket can be found in the attachments.\n\n' + new Date().toString() + '\nPlease note that '
    + 'the ticket must be printed.\n Other important points:\nThe ticket(s) do not expire.\nThe date on the ticket is the ' 
    + 'date ticket is generated, not your purchase date.\n You may receive email from ydbusinessinfo@frontpass.net to follow up with your purchase',
    'attachments': options.attachments
    // 'attachments': [{
    //   'filename': '1.txt',
    //   'path': 'http://frontpass-test.s3.amazonaws.com/unsold/1.txt?AWSAccessKeyId=AKIAJWITSAE6ZXNBAKEA&Expires=1428547144&Signature=9cCHR5FOlMnpnEtlJ5TB2Qmk9NQ%3D'}]
  };

  console.log(mailOptions);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + info.response);
      callback(options.attachments);
    }
  });
};


exports.stockWarning = function (count) {
  var mailOptions = {
    'from': config.email,
    'to': config.email,
    'subject': '⚠ Ticket Express warning: only ' + count + ' tickets left',
    'text': 'Stock warning level is set at ' + config.stockWarning + '\n\n' + new Date().toString()
  };

  console.log(mailOptions);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });
};
