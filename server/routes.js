var requestHandler = require('./requestHandler.js');
var path = require('path');
//add other controllers here



module.exports = function (app, express){
  app.post('/api/getYelp', requestHandler.getYelp);

  app.get('/api/getUber', requestHandler.getUber);
  //app.post('/', requestHandler.someotherfn);
  app.get('/api/uberRedir', requestHandler.uberRedir);

  app.post('/api/uberPrice', requestHandler.uberPrice);

  app.post('/api/uberRide', requestHandler.uberRide);

  app.get('/api/authGoogle', requestHandler.authGoogle);

  app.get('/api/googleRedir', requestHandler.googleRedir);

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'client','index.html'));
  });

};