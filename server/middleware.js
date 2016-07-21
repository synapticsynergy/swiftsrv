var bodyParser = require('body-parser');
var stormpath = require('express-stormpath');
var path = require('path');


module.exports = function (app, express){
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static('client'));


  app.use(stormpath.init(app, {
    web: {
      spa: {
        enabled: true,
        view: path.join(__dirname, '..', 'client','index.html')
      },
      me: {
        expand: {
          customData: true,
          groups: true
        }
      }
    }
  }));




};