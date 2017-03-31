var requestHandler = require('./requestHandler.js');
var path = require('path');
var cors = require('cors');
//add other controllers here

module.exports = function (app, express){
  app.use(cors());

  app.post('/api/getYelp', requestHandler.getYelp);

  app.get('/api/getUber', requestHandler.getUber);
  //app.post('/', requestHandler.someotherfn);
  app.get('/api/uberRedir', requestHandler.uberRedir);

  app.post('/api/uberPrice', requestHandler.uberPrice);

  app.post('/api/uberRide', requestHandler.uberRide);

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'client','index.html'));
  });

};