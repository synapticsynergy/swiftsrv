var oauthSignature = require('oauth-signature');
var qs = require('querystring');
var request = require('request');
var _ = require('lodash');
var UBER = require('node-uber');
var n = require('nonce');
// THE FOLLOWING FILES ARE FOR CONFIGS FOR UBER AND YELP
// YOU MUST MAKE YOUR OWN ACCOUNTS AND PUT THE INFORMATION IN THE
// .CONFIG file.  THEN, UNCOMMENT THIS TO CONNECT IT.
// var Yelp = require('./config.js').Yelp;
// var uberConfig = require('./config.js').Uber;


var ts = Date.now();
var non = n();
var host = "";

if(process.env.PORT){
  host = "https://swiftsrv.herokuapp.com";

  Yelp = {
    oauth_consumer_key: process.env.YELP_KEY,
    consumersecret: process.env.YELP_SECRET,
    oauth_token: process.env.YELP_OAUTH,
    tokensecret: process.env.YELP_TOKEN,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: ts,
    oauth_nonce: non(),
    oauth_version: "1.0"
  };

  uberConfig = {
    client_id: process.env.UBER_CLIENT_ID,
    client_secret: process.env.UBER_CLIENT_SECRET,
    server_token: process.env.UBER_SERVER_TOKEN,
    redirect_uri: host + "/api/uberRedir",
    name: "SwiftServ",
    sandbox: true
  };
} else {
  host = "http://localhost:3000";
}


var Uber = new UBER(uberConfig);

var constructQuery = function(searchParam){
  var baseurl = 'https://api.yelp.com/v2/search';

  var params = {  limit: 20,
                  sort: 2
                  };

  var fullParams = _.extend(params, searchParam, Yelp);


  var signature = oauthSignature.generate('GET', baseurl, fullParams, Yelp.consumersecret, Yelp.tokensecret, { encodeSignature: true});

  fullParams.oauth_signature = signature;

  var paramURL = qs.stringify(fullParams);

  var url = baseurl + '?' + paramURL;
  console.log('URL IS: ',url);
  return url;
};

module.exports = {

  getYelp: function(req, res, next){
    console.log('req body is: ', req.body);
    //data: {category: "", location: ""}
    var yelpURL = constructQuery(req.body);

    request(yelpURL, function(err, response, body){
      //send GET request to YELP API, receive YELP result in response
      //send response as res for getYelp request.
      if (!err && response.statusCode === 200){
        console.log(body);
        res.status(200).send(body);
      } else {
        //error getting stuff from yelp
        console.log('error getting stuff from Yelp');
      }
    });

  },

  getUber: function(req, res, next){

    var tokenURL = Uber.getAuthorizeUrl(['history','profile', 'request', 'places']);
    console.log('tokenURL', tokenURL);
    res.status(200).send(tokenURL);

  },

  uberRedir: function(req, res, next){

      Uber.authorization({
       authorization_code: req.query.code
     }, function(err, access_token, refresh_token) {
       if (err) {
         console.error(err);
       } else {
         // store the user id and associated access token
         // redirect the user back to your actual app
         res.redirect('/#/uber');
       }
     });

  },

  uberPrice: function(req, res, next){

    console.log("price location is ", req.body);

    Uber.estimates.getPriceForRoute(req.body.start_lat, req.body.start_long, req.body.final_lat, req.body.final_long, function (err, resp) {
      if (err) {
        console.error(err);
      } else {
        console.log(resp);
        res.status(200).send(resp);
      }
    });


  },

   uberRide: function(req, res, next){

    console.log("Ride info is ", req.body);

    Uber.requests.create({
      "product_id": req.body.productId,
      "start_latitude": req.body.start_lat,
      "start_longitude": req.body.start_long,
      "end_latitude": req.body.final_lat,
      "end_longitude": req.body.final_long
    }, function (err, resp) {
      if (err) {
        console.error(err);
      } else {
        console.log('ride result ', resp);
        res.status(200).send(resp);
      }
    });

  },


};

