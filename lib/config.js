var config = {};

// paypal development config
config.paypalConfig = {
	'mode': 'sandbox', //sandbox or live
  'host': 'api.sandbox.paypal.com',
  'client_id': 'AWwiAH-6_sxLtey1kdl9neYx-VknkJP8vhr83Y6RoMTPDa8n6O_6GiP9n-8WsvX2SdyNvHyR67e4fuL3',
  'client_secret': 'EM9mcT5rp50H3mLJtR23wBHhol6SXQKu5BglwKoZ0WJmIK4V_-XJqbiHmWcm5V49fwpjEbuEBynQ7oe0'
};
config.paypalRedirectUrls = {
  'return_url': 'http://localhost:3000/order',
  'cancel_url': 'http://localhost:3000/cancel'
};

// s3 config
config.AWS_ACCESS_KEY_ID = 'AKIAJWITSAE6ZXNBAKEA';
config.AWS_SECRET_ACCESS_KEY = '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';

// s3 bucket name
config.AWS_S3_NAME = 'frontpass-test';

module.exports = config;
