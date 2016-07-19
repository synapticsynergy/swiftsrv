var requestHandler = require('./requestHandler.js');


//add other controllers here



module.exports = function (app, express){
  app.post('/api/getYelp', requestHandler.getYelp);

  //app.post('/', requestHandler.someotherfn);

};