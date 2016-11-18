var request = require('supertest')
  , should = require('should');
var init = require('../init');

var app;
var agent = init.agent;
var config = init.config;

describe('Registration', function () {
  this.timeout(100000);
  before(function (done) {
    init.resetDatabase(done);
  });

  it('POST /authentication/register should return 400 (user already exists)', function (done) {
    agent
      .post('/authentication/register')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({email: 'user@user.cz', password: 'user'}))
      .expect(400, function (err, res) {
        should.not.exist(err);
        res.body.should.have.property('error').and.be.instanceOf(Array).and.lengthOf(1);
        res.body.error[0].should.equal('email_already_exist');
        done(err);
      });
  });

  it('POST /authentication/register should return 201 (created)', function (done) {
    agent
      .post('/authentication/register')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({email: 'test@test.cz', password: 'test'}))
      .expect(201, function (err, res) {
        should.not.exist(err);
        done(err);
      });
  });

  it('POST /login should return wrong credentials', function (done) {
    agent
      .post('/authentication/login')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({email: 'test@test.cz', password: 't'}))
      .expect({'error': 'err_invalid_credentials'})
      .expect(400)
      .end(function (err, res) {
        done(err);
      });
  });

  var access_token;
  it('POST /login should log user in and return access_token', function (done) {
    agent
      .post('/authentication/login')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({email: 'test@test.cz', password: 'test'}))
      .expect(201)
      .end(function (err, res) {
        should.not.exist(err);
        res.body.should.have.property('access_token');
        access_token = res.body.access_token;
        done(err);
      });
  });

  it('GET /logout should return 204', function (done) {
    agent
      .get('/authentication/logout')
      .set('Content-Type', 'application/json')
      .set('access-token', access_token)
      .expect(204, function (err, res) {
        should.not.exist(err);
        done(err);
      });
  });

  it('GET /logout should return 401', function (done) {
    agent
      .get('/authentication/logout')
      .set('Content-Type', 'application/json')
      .set('access-token', access_token)
      .expect(401, function (err, res) {
        should.not.exist(err);
        done(err);
      });
  });
})
