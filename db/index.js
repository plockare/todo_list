var mysql = require('mysql');
var path = require('path');
var fs = require('fs');
var async = require('async');
var config = require("../config");
var db = mysql.createConnection({
	host: config.ENV.database.host,
	user: config.ENV.database.user,
	password: config.ENV.database.password,
	multipleStatements: true
});
var method = process.argv[2];
var internals = {};

internals._sqldir = __dirname + '/sql';

internals._runfile = function _runfile(s, fname, callback, optional) {
	var sql;

	if (typeof fname == 'function') {
		callback = fname;
		fname = s;
		sql = 'USE ' + config.ENV.database.database + '; \n'
	} else {
		sql = s;
	}
	var fpath = path.resolve(internals._sqldir, fname);
	if (!fs.existsSync(fpath)) {
		if (optional === true) {
			return callback();
		}

		return callback(Error('sql file not found - ' + fpath));
	}
	if (!fs.lstatSync(fpath).isFile()) return callback(Error(fpath + ' is not a file'));
	try {
		sql += fs.readFileSync(fpath, 'utf8');
	}
	catch (e) {
		return callback(Error('error reading ' + fpath + ' - ' + e.stack))
	}
	if (!sql.trim()) return callback(Error('empty file - ' + fpath));
	console.log('Running file: ' + fpath);
	db.query(sql, callback);
};

internals.schema = function schema() {
	console.log('db.schema');
	var query = '';

	query += 'DROP DATABASE IF EXISTS ' + config.ENV.database.database + '; \n';
	query += 'CREATE DATABASE IF NOT EXISTS ' + config.ENV.database.database + ' DEFAULT CHARACTER SET utf8; \n';
	query += 'USE ' + config.ENV.database.database + ';';

	db.query(query, function (e, r) {
		if (e) throw e;
		internals._runfile('schema.sql', function (e, r) {
			if (e) throw e;
			process.exit(0);
		});
	});
};

internals.base = function base() {
	console.log('db.base');
	internals._runfile('data-base.sql', function (e, r) {
		if (e) throw e;
		process.exit(0);
	});
};

internals.test = function test() {
	console.log('db.test');
	internals._runfile('data-test.sql', function (e, r) {
		if (e) throw e;
		process.exit(0);
	});
};

internals.local = function local() {
	console.log('db.local');
	internals._runfile('data-local.sql', function (e, r) {
		if (e) throw e;
		process.exit(0);
	});
};

internals.dev = function dev() {
	console.log('db.dev');
	internals._runfile('data-dev.sql', function (e, r) {
		if (e) throw e;
		process.exit(0);
	});
};

internals.truncate = function truncate() {
	console.log('db.truncate');
	var t, tables = config.db.tables;
	var query = '';

	query += 'USE ' + config.ENV.database.database + '; \n';
	query += 'SET foreign_key_checks = 0; \n';
	for (t in tables) {
		query += "TRUNCATE `" + tables[t] + "`; \n";
	}

	query += 'SET foreign_key_checks = 1; \n';
	db.query(query, function (e, r) {
		if (e) throw e;
		process.exit(0);
	});
};

if (internals.hasOwnProperty(method)) {
	internals[method]();
} else {
	console.log('invalid method specified - ' + method);
	process.exit(1);
}
