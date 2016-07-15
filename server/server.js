var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('client'));


app.get('/', function(req,res){
  console.log('Do something');
});


module.exports = app;