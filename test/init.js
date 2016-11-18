import app from '../src/app';
import config from 'cfg-loader';

var request = require('supertest')
  , async = require("async")
  , mysql = require("mysql");

var object = {
  app,
  config,
  users: []
};
const db = require('../db/lib');
object.agent = request.agent(object.app);
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
  object.agent.post("/authentication/login")
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


object.resetDatabase = function resetDatabase(callback) {
  async.waterfall([
    (done) => db.clean((err) => done(err)),
    (done) => db.test((err) => done(err))
  ], callback);
};

module.exports = object;