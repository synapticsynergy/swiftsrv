var express = require('express');
//var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

app.use(cors());

require('./middleware.js')(app, express);
require('./routes.js')(app, express);


module.exports = app;

