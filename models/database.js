var mongoose = require('mongoose');
var dbURI = 'mongodb://chenzhepeter:rimm2013@ds049180.mongolab.com:49180/chromeism';
// mongoose.connect('mongodb://localhost/extractor');
mongoose.connect(dbURI);

mongoose.connection.on('error', function (err) {
  console.log('mongoose connection error: ' + err);
});

mongoose.connection.on('connected', function () {
  console.log('mongoose connected to: ' + dbURI);
});

mongoose.connection.on('disconnected', function () {
  console.log('mongoose disconnected');
});

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('mongoose discconected through app termination');
    process.exit(0);
  });
});

module.exports = mongoose;
