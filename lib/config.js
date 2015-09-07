var config = {};

// paypal production config
config.paypalConfig = {
  'mode': 'live',
  'host': 'api.paypal.com',
  'client_id': 'AWDQvbl_bU2mzvwljw-_YQ0HdncacUSOiLPL_q3ByWmIcH2cYVhwEQY0sDUOaTr88snDNzs3Xu1Xkd0d',
  'client_secret': 'EMU0gpVWP24rCA0iS4pUqvUv4l_FrI1fj9x0vKxJcF692ttnuXf83uRmdiV1c8RFvEIliaonnNfqjSbK'
};
config.paypalRedirectUrls = {
  'return_url': 'http://www.frontpass.net/order',
  'cancel_url': 'http://www.frontpass.net/cancel'
};

// s3 production config
config.AWS_ACCESS_KEY_ID = 'AKIAJWITSAE6ZXNBAKEA';
config.AWS_SECRET_ACCESS_KEY = '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';

module.exports = config;
