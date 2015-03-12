var config = require('../lib/config');

exports.get = function (req, res) {
  res.render('login', {
    'title': 'Login',
    'user': req.session.user,
    'success': req.flash('success').toString(),
    'error': req.flash('error').toString()
  });
};

exports.post = function (req, res) {
  if (config.user.password !== req.body.password || config.user.name !== req.body.name) {
    req.flash('error', 'Erro: name or password does not match!');
    return res.redirect('/login');
  }
  req.session.user = req.body.name;
  req.flash('success', 'Login success!');
  console.log('Login success ' + req.body.name);
  res.redirect('/admin');
};

exports.logout = function (req, res) {
  req.session.user = null;
  req.flash('success', 'Logout success!');
  res.redirect('/login');
};
