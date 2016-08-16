'use strict'

let path = require('path');
module.exports = require('./config.json');
module.exports.ENV = require('./env.json');
module.exports.resource_path = path.join(__dirname, '..', 'resources');
module.exports.module_path = path.join(__dirname, '..', 'modules');
