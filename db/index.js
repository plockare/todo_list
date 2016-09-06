var path = require('path');
var fs = require('fs');
var async = require('async');
var config = require("../config");
var exec = require('child_process').exec;

const baseCmd = `flyway -user=${config.ENV.database.user} -password=${config.ENV.database.password} -url=jdbc:mysql://${config.ENV.database.host} -schemas=${config.ENV.database.database}`;
const locations = `-locations=filesystem:${__dirname}/sql,filesystem:${__dirname}/`;

var method = process.argv[2];
var internals = {};

internals._sqldir = __dirname + '/sql';

internals._runfile = function _runfile(s, callback) {
	console.log('db.schema');
	exec(baseCmd + ' ' + locations + s + ` migrate`, function (err, stdout) {
		console.log(stdout);
		callback(err);
	});
};


internals.test = function test() {
	console.log('db.test');
	internals._runfile('test', function (e, r) {
		if (e) throw e;
		process.exit(0);
	});
};

internals.local = function local() {
	console.log('db.local');
	internals._runfile('local', function (e, r) {
		if (e) throw e;
		process.exit(0);
	});
};

internals.dev = function dev() {
	console.log('db.dev');
	internals._runfile('dev', function (e, r) {
		if (e) throw e;
		process.exit(0);
	});
};

internals.clean = function clean() {
	console.log('db.clean');
	exec(baseCmd + ' clean', function (err, stdout) {
		console.log(stdout);
		if (err) throw err;
		process.exit(0);
	});
};

if (internals.hasOwnProperty(method)) {
	internals[method]();
} else {
	console.log('invalid method specified - ' + method);
	process.exit(1);
}
