var nodemailer = require('nodemailer');
var config = require('./config');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  host: 'smtp.mandrillapp.com',
  port: 587,
  auth: {
    user: 'chenzhepeter@gmail.com',
    pass: '06ySXeyPdN5LRcrk6Jl-0Q',
  }
});

exports.send = function (options) {
  var mailOptions = {
    'from': config.email,
    'to': options.to,
    'subject': '✔ Ticket Express sales: ' + options.id,
    'text': 'Thanks for your purchase at Ticket Express!\n Your ticket can be found in the attachments.\n\n' + new Date().toString(),
    'attachments': options.attachments
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
