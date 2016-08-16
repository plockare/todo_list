global.CONFIG = require('./config');
global.APIError = require(CONFIG.module_path + '/error');
require('any-promise/register')('bluebird');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var validation = require(CONFIG.module_path + '/validation');
var resources = require('./resources');
var app = express();

app.use(expressValidator(validation.options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

resources(app);

module.exports = app;
