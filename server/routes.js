var requestHandler = require('./requestHandler.js');


//add other controllers here



module.exports = function (app, express){
  app.post('/api/getYelp', requestHandler.getYelp);

  app.get('/api/getUber', requestHandler.getUber);
  //app.post('/', requestHandler.someotherfn);
  app.get('/api/uberRedir', requestHandler.uberRedir);

};