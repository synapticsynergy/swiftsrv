// API v2.0

// Consumer Key  64XR6hqr1y1Z0asgJn8O2g
// Consumer Secret af8A4H5Hm8B-iKteM6UuipShz0c
// Token iIT7yl4Lt9EHTRkTsR9iqyaw4eYCEHbw
// Token Secret  NAK8_0aY814vCUIcCSSOeGolxtQ

//url format
//&oauth_consumer_key=64XR6hqr1y1Z0asgJn8O2g&oauth_token=iIT7yl4Lt9EHTRkTsR9iqyaw4eYCEHbw&oauth_signature_method=HMAC-SHA1&oauth_timestamp=***********&oauth_nonce=************&oauth_version=1.0&oauth_signature=2XRYeNqQJ9%2FOFekZ7chSoWxL7Kw%3D

//timestamp = datenow
//nonce = timestamp + rando-number

var n = require('nonce');

var ts = Date.now();
var non = n();


module.exports = {
  consumerkey: "64XR6hqr1y1Z0asgJn8O2g",
  consumersecret: "af8A4H5Hm8B-iKteM6UuipShz0c",
  token: "iIT7yl4Lt9EHTRkTsR9iqyaw4eYCEHbw",
  tokensecret: "NAK8_0aY814vCUIcCSSOeGolxtQ",
  signaturemethod: "HMAC-SHA1",
  timestamp: ts,
  nonce: non(),
  version: "1.0"
};

