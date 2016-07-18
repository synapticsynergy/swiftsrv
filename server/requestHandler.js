var oauthSignature = require('oauth-signature');
var qs = require('querystring');
var request = require('request');
var _ = require('lodash');
var config = require('./config.js');

var constructQuery = function(searchParam){
  var baseurl = 'https://api.yelp.com/v2/search';

  var params = { location: "San Francisco",
                  term: "food",
                  limit: 5,
                  sort: 2
                  };

  var fullParams = _.assign(params, searchParam, config);


  var signature = oauthSignature.generate('GET', baseurl, fullParams, config.consumersecret, config.tokensecret, { encodeSignature: true});

  fullParams.oauth_signature = signature;

  var paramURL = qs.stringify(fullParams);

  var url = baseurl + '?' + paramURL;
  console.log('URL IS: ',url);
  return url;
};

module.exports = {

  getYelp: function(req, res, next){
    console.log('req body is: ', req.body.data);
    //data: {category: "", location: ""}
    var yelpURL = constructQuery(req.body.data);

    request(yelpURL, function(err, response, body){
      //send GET request to YELP API, receive YELP result in response
      //send response as res for getYelp request.
      if (!err && response.statusCode === 200){
        res.status(200).send(body);
      } else {
        //error getting stuff from yelp
        console.log('error getting stuff from Yelp');
      }
    });

  }

};


// module.exports = {
//   consumerkey: "64XR6hqr1y1Z0asgJn8O2g",
//   consumersecret: "af8A4H5Hm8B-iKteM6UuipShz0c",
//   token: "iIT7yl4Lt9EHTRkTsR9iqyaw4eYCEHbw",
//   tokensecret: "NAK8_0aY814vCUIcCSSOeGolxtQ",
//   signaturemethod: "HMAC-SHA1",
//   timestamp: n().toString().substr(0,10),
//   nonce: n(),
//   version: "1.0"
// };



//url format
//https://api.yelp.com/v2/search?term=food&location="San Francisco"&oauth_consumer_key=64XR6hqr1y1Z0asgJn8O2g&oauth_token=iIT7yl4Lt9EHTRkTsR9iqyaw4eYCEHbw&oauth_signature_method=HMAC-SHA1&oauth_timestamp=***********&oauth_nonce=************&oauth_version=1.0&oauth_signature=2XRYeNqQJ9%2FOFekZ7chSoWxL7Kw%3D
