var oauthSignature = require('oauth-signature');
var qs = require('querystring');
var request = require('request');
var _ = require('lodash');
var Yelp = require('./config.js').Yelp;
var uberConfig = require('./config.js').Uber;
var UBER = require('node-uber');

var Uber = new UBER(uberConfig);

var constructQuery = function(searchParam){
  var baseurl = 'https://api.yelp.com/v2/search';

  var params = {  limit: 5,
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
         res.redirect('/');
       }
     });

  }



};


