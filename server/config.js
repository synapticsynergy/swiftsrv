// YELP API v2.0 OAUTH 1.0a

// Consumer Key  64XR6hqr1y1Z0asgJn8O2g
// Consumer Secret af8A4H5Hm8B-iKteM6UuipShz0c
// Token iIT7yl4Lt9EHTRkTsR9iqyaw4eYCEHbw
// Token Secret  NAK8_0aY814vCUIcCSSOeGolxtQ

//url format
//&oauth_consumer_key=64XR6hqr1y1Z0asgJn8O2g&oauth_token=iIT7yl4Lt9EHTRkTsR9iqyaw4eYCEHbw&oauth_signature_method=HMAC-SHA1&oauth_timestamp=***********&oauth_nonce=************&oauth_version=1.0&oauth_signature=2XRYeNqQJ9%2FOFekZ7chSoWxL7Kw%3D

// UBER API v1.0 OAUTH 2.0

// Client Id 1dPbx-9-3Sz7WrFVQR7K0gjJCOuUZhdh
// Client Secret 2PtmgTtY-H6k8vkpfezPQXka7XuW4SWtd1AhpzGg
// Server token  Lbgr7WY6COErXCRZ0S71NQ-BO6pDmTpDA9ced0ld




var n = require('nonce');

var ts = Date.now();
var non = n();


module.exports.Yelp = {
  oauth_consumer_key: "64XR6hqr1y1Z0asgJn8O2g",
  consumersecret: "af8A4H5Hm8B-iKteM6UuipShz0c",
  oauth_token: "iIT7yl4Lt9EHTRkTsR9iqyaw4eYCEHbw",
  tokensecret: "NAK8_0aY814vCUIcCSSOeGolxtQ",
  oauth_signature_method: "HMAC-SHA1",
  oauth_timestamp: ts,
  oauth_nonce: non(),
  oauth_version: "1.0"
};

module.exports.Uber = {
  client_id: "1dPbx-9-3Sz7WrFVQR7K0gjJCOuUZhdh",
  client_secret: "2PtmgTtY-H6k8vkpfezPQXka7XuW4SWtd1AhpzGg",
  server_token: "Lbgr7WY6COErXCRZ0S71NQ-BO6pDmTpDA9ced0ld",
  redirect_uri: "http://localhost:3000/api/uberRedir",
  name: "SwiftServ",
  sandbox: true
};

