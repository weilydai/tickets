var express = require('express');
var path = require('path');
var session = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var schedule = require('node-schedule');
var hbs = require('./lib/hbs');
var routes = require('./routes/index');
var paypal = require('./lib/paypal');
var ticket = require('./lib/ticket');
var mail = require('./lib/mail');
var http = require('http');
var s3 = require('./lib/s3');
// Initialing the FrontPass with required data for ticket sales management
// Update how many tickets are in the system
ticket.initList();
// Periodically update inventory
var initUnsold = schedule.scheduleJob('0 */1 * * *',ticket.initList);

//End required initialization for ticket sales management

//App logging
var app = express();
var fs = require('fs');
var accessLog = fs.createWriteStream(__dirname + '/access.log', {
  flags: 'a'
});
var errorLog = fs.createWriteStream(__dirname + '/error.log', {
  flags: 'a'
});

// setup the logger
app.use(logger('combined', {
  stream: accessLog
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(session({
  secret: 'myscret',
  cookie: {
    maxAge: 9 * 60 * 1000
  },
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.use(function (err, req, res, next) {
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  errorLog.write(meta + err.stack + '\n');
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;


app.set('port', process.env.PORT || 3000);

http.globalAgent.maxSockets = 25;
http.createServer(app).listen(app.get('port'), function() {
  console.log('APP is listening on port ' + app.get('port'));
  console.log('Max number of open sockets is ' + http.globalAgent.maxSockets);
});