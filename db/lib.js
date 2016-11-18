var path = require('path');
var fs = require('fs');
var async = require('async');
var config = require('cfg-loader').default;
var exec = require('child_process').exec;

const baseCmd = `flyway -user=${config.postgres.user} -password=${config.postgres.password} -url=jdbc:mysql://${config.postgres.host} -schemas=${config.postgres.database}`;
const locations = `-locations=filesystem:${__dirname}/sql,filesystem:${__dirname}/`;

var internals = {};

internals._sqldir = __dirname + '/sql';

internals._runfile = function _runfile(s, callback) {
  console.log('db.schema');
  exec(baseCmd + ' ' + locations + s + ` migrate`, function (err, stdout) {
    console.log(stdout);
    callback(err);
  });
};

internals.test = function test(cb) {
  console.log('db.test');
  internals._runfile('test', cb);
};

internals.local = function local(cb) {
  console.log('db.local');
  internals._runfile('local', cb);
};

internals.dev = function dev(cb) {
  console.log('db.dev');
  internals._runfile('dev', cb);
};

internals.clean = function clean(cb) {
  console.log('db.clean');
  exec(baseCmd + ' clean', cb);
};

export default internals;
