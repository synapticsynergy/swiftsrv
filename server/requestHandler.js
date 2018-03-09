var oauthSignature = require('oauth-signature');
var qs = require('querystring');
var request = require('request');
var rp = require('request-promise');
var http = require('http');
var _ = require('lodash');
var UBER = require('node-uber');
var n = require('nonce');
// THE FOLLOWING FILES ARE FOR CONFIGS FOR UBER AND YELP
// YOU MUST MAKE YOUR OWN ACCOUNTS AND PUT THE INFORMATION IN THE
// .CONFIG file.  THEN, UNCOMMENT THIS TO CONNECT IT.
var Yelp;
var uberConfig;

var ts = Date.now();
var non = n();
var host = "";

if(process.env.PORT){
  host = "https://blaked.herokuapp.com";

  Yelp = {
    client_secret: process.env.YELP_SECRET,
    client_id: process.env.YELP_CLIENT_ID,
    API_key: process.env.YELP_API_KEY
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
  Yelp = require('./config.js').Yelp;
  uberConfig = require('./config.js').Uber;
}


var Uber = new UBER(uberConfig);


var constructQuery = function(searchParam){
  // var baseurl = 'https://api.yelp.com/v2/search';
  var baseurl = 'https://api.yelp.com/v3/businesses/search';

  var params = {  limit: 50,
                  open_now: true,
                  sort_by: 'best_match'
                  };

  // var fullParams = _.extend(params, searchParam, Yelp);
  var fullParams = _.extend(params, searchParam);


  // var signature = oauthSignature.generate('GET', baseurl, fullParams, Yelp.consumersecret, Yelp.tokensecret, { encodeSignature: true});

  // fullParams.oauth_signature = signature;

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

    var yelp_access_token;

    request.post({url:'https://api.yelp.com/oauth2/token',form: {grant_type: 'client_credentials', client_id: Yelp.client_id, client_secret: Yelp.client_secret}}, function(err,response,body){

      yelp_access_token = JSON.parse(response.body).access_token;
      // var yelpAuth = {auth: {bearer: yelp_access_token}};

      //Quick change for auth change. API key only needed now.
      var yelpAuth = {auth: {bearer: Yelp.API_key}};

      request(yelpURL, yelpAuth, function(err, response, body){
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

