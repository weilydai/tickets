exports.get = function (req, res) {
  res.render('cancel', {
    'title': 'Cancel',
    'user': req.session.user
  });
};
