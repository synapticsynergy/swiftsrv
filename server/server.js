var express = require('express');
//var bodyParser = require('body-parser');
var app = express();

require('./middleware.js')(app, express);
require('./routes.js')(app, express);


module.exports = app;