var Dropbox = require("dropbox");

var client = new Dropbox.Client({
	key: 'tbbfu1cwx9ymbns',
	secret: 'jinb1wfutyjhdfx',
	token: 'EGZ72p9SvPMAAAAAAAAADC8LKjFTZk-rT2Y6WVBgxHa0eUP7M7E2iAlGEPQ3s0f8'
});
var dropbox = {};

client.authDriver(new Dropbox.AuthDriver.NodeServer(8191));

exports.getInfo = function () {
	client.readdir('/Tickets/unsold', function(error, entries) {
	  if (error) {
	    console.log(error);  // Something went wrong.
	  }

	  console.log(entries.join(','));
	});
};