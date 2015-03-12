var hbs = require('hbs');
var moment = require('moment');
hbs.registerPartials(__dirname + '/../views/partials');

hbs.registerHelper('showdate', function (date) {
  return moment(date).format("YYYY-MM-DD");
});

hbs.registerHelper('showTime', function (date) {
  return moment(date).format("YYYY-MM-DD hh:mm");
});

hbs.registerHelper('fromNow', function (date) {
  if (date) {
    return moment(date).fromNow();
  } else {
    return "hasn't happened yet";
  }
});

hbs.registerHelper('truth', function (input) {
  return input ? 'true' : 'false';
});

hbs.registerHelper('length', function (obj) {
  if (obj.length){
    return obj.length;
  }
  return 0;
});

hbs.registerHelper('parseTransaction', function (transactions) {

  if (transactions && transactions[0] && transactions[0].amount) {
    return transactions[0].amount.total + transactions[0].amount.currency;
  }

});

module.exports = hbs;
