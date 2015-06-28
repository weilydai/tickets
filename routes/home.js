var session = require('express-session');

exports.get = function (req, res) {
  res.render('home', {
    'title': 'Home',
    'user': req.session.user,
    'success': req.flash('success').toString(),
    'error': req.flash('error').toString()
  });
};

exports.get_cn = function(req, res) {
	res.render('home_cn', {
		'title': 'Home',
		'user': req.session.user,
	    'success': req.flash('success').toString(),
	    'error': req.flash('error').toString()
	});
};
