var request = require('supertest')
	, async = require("async")
	, mysql = require("mysql")
	, npm = require("npm");

process.env.NODE_ENV = 'test';
var object = {};
var config = object.config = require(__dirname + '/../config');
object.app = require('../app.js');
object.config = config;
object.agent = request.agent(object.app);
object.db = mysql.createConnection({
	host: config.ENV.database.url,
	user: config.ENV.database.user,
	password: config.ENV.database.password,
	multipleStatements: true
});

object.users = [];

var credentials = [
	{"email": 'user@user.cz', "password": "user"}
];

object.logUsers = function (done) {
	if (typeof done !== 'function') throw Error('done - ' + (typeof done) + ' is not a function');

	async.map(credentials, object.logUser, function (err, result) {
		if (err) return done(err);
		object.users = result;
		done();
	});
};

object.logUser = function (credentials, done) {
	object.agent.post(config.uri_segments.authentication + "/login")
		.set('content-type', "application/json")
		.send(JSON.stringify({
			"email": credentials.email,
			"password": credentials.password
		}))
		.expect(201, function (err, result) {
			done(err, result ? result.body.access_token : null);
		});
};

object.binaryParser = function (res, callback) {
	res.setEncoding('binary');
	res.data = '';
	res.on('data', function (chunk) {
		res.data += chunk;
	});
	res.on('end', function () {
		callback(null, res.data);
	});
};


object.resetDatabase = function resetDatabase(done) {
	npm.load(function (err) {
		if (err) {
			console.error(err);
			return process.exit();
		}

		async.waterfall([
			function (done) {
				npm.commands.run(['env-test'], function (err, data) {
					done(err);
				});
			}
		], done);
	});
};

module.exports = object;