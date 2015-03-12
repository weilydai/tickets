var express = require('express');
var router = express.Router();

var home = require('./home');
var order = require('./order');
var cancel = require('./cancel');
var admin = require('./admin');
var login = require('./login');
var download = require('./download');

/* GET home page. */
router.get('/', home.get);
router.get('/cancel', cancel.get);
router.post('/order', order.post);
router.get('/order/', order.get);
router.post('/download', download.post);
router.get('/admin', admin.get);
router.post('/admin', admin.post);
router.get('/login', login.get);
router.post('/login', login.post);
router.get('/logout', login.logout);

module.exports = router;
