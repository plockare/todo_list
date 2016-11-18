'use strict';

var request = require('supertest')
  , should = require('should');
var init = require("../init");

var app;
var agent = init.agent;
var config = init.config;
var users;

describe('Todo item', function () {
  this.timeout(100000);
  before(function (done) {
    init.resetDatabase(function (err) {
      if (err)return done(err);
      init.logUsers(function (err) {
        if (err)return done(err);
        users = init.users;
        done();
      });
    });
  });

  it('POST /todo-item should return 401 (unauthorized)', function (done) {
    agent
      .post('/todo-item')
      .set('Content-Type', 'application/json')
      .set('access-token', 'fdsjfosjfoiejoejfownfi')
      .send(JSON.stringify({
        label: 'test'
      }))
      .expect(401, function (err, res) {
        should.not.exist(err);
        done(err);
      });
  });

  let itemId;
  it('POST /todo-item should return 201 (created)', function (done) {
    agent
      .post('/todo-item')
      .set('Content-Type', 'application/json')
      .set('access-token', users[0])
      .send(JSON.stringify({
        label: 'test'
      }))
      .expect(201, function (err, res) {
        should.not.exist(err);
        res.body.should.have.property('id');
        res.body.should.have.property('label', 'test');
        itemId = res.body.id;
        done(err);
      });
  });

  it('GET /todo-item should return 200 (1 item)', function (done) {
    agent
      .get('/todo-item')
      .set('Content-Type', 'application/json')
      .set('access-token', users[0])
      .expect(200, function (err, res) {
        should.not.exist(err);
        res.body.should.be.instanceOf(Array).and.lengthOf(1);
        done(err);
      });
  });

  it('GET /todo-item/404 should return 404 (not found)', function (done) {
    agent
      .get('/todo-item/404')
      .set('Content-Type', 'application/json')
      .set('access-token', users[0])
      .expect(404, function (err, res) {
        should.not.exist(err);
        done(err);
      });
  });

  it('PUT /todo-item/{id=1} should return 204 (updated)', function (done) {
    agent
      .put(`/todo-item/${itemId}`)
      .set('Content-Type', 'application/json')
      .set('access-token', users[0])
      .send(JSON.stringify({
        label: 'test 2'
      }))
      .expect(204, function (err, res) {
        should.not.exist(err);
        done(err);
      });
  });

  it('GET /todo-item/{id=1} should return 200 (detail of an item)', function (done) {
    agent
      .get(`/todo-item/${itemId}`)
      .set('Content-Type', 'application/json')
      .set('access-token', users[0])
      .expect(200, function (err, res) {
        should.not.exist(err);
        res.body.should.have.property('id', itemId);
        res.body.should.have.property('label', 'test 2');
        res.body.should.have.property('completed', false);
        res.body.should.have.property('completed_at', null);
        done(err);
      });
  });

  it('DELETE /todo-item/{id=1} should return 204 (item deleted)', function (done) {
    agent
      .delete(`/todo-item/${itemId}`)
      .set('Content-Type', 'application/json')
      .set('access-token', users[0])
      .expect(204, function (err, res) {
        should.not.exist(err);
        done(err);
      });
  });

  it('DELETE /todo-item/{id=1} should return 404 (item not found)', function (done) {
    setTimeout(() =>
        agent
          .delete(`/todo-item/${itemId}`)
          .set('Content-Type', 'application/json')
          .set('access-token', users[0])
          .expect(404, function (err) {
            should.not.exist(err);
            done(err);
          })
      , 1000);
  });

  it('PUT /todo-item/{id=2}/state should return 404 (item not found)', function (done) {
    agent
      .put(`/todo-item/${itemId}/state`)
      .set('Content-Type', 'application/json')
      .set('access-token', users[0])
      .send(JSON.stringify({
        state: 'COMPLETED'
      }))
      .expect(404, function (err, res) {
        should.not.exist(err);
        done(err);
      });
  });

  it('GET /todo-item/{id=1} should return 404 (not found)', function (done) {
    agent
      .get(`/todo-item/${itemId}`)
      .set('Content-Type', 'application/json')
      .set('access-token', users[0])
      .expect(404, function (err, res) {
        should.not.exist(err);
        done(err);
      });
  });

  it('PUT /todo-item/{id=1} should return 404 (not found)', function (done) {
    agent
      .put(`/todo-item/${itemId}`)
      .set('Content-Type', 'application/json')
      .set('access-token', users[0])
      .send(JSON.stringify({
        label: 'test 2'
      }))
      .expect(404, function (err, res) {
        should.not.exist(err);
        done(err);
      });
  });

  it('POST /todo-item should return 201 (created)', function (done) {
    agent
      .post('/todo-item')
      .set('Content-Type', 'application/json')
      .set('access-token', users[0])
      .send(JSON.stringify({
        label: 'pokus'
      }))
      .expect(201, function (err, res) {
        should.not.exist(err);
        res.body.should.have.property('id');
        res.body.should.have.property('label', 'pokus');
        itemId = res.body.id;
        done(err);
      });
  });

  it('PUT /todo-item/{id=2}/state should return 204 (state updated)', function (done) {
    agent
      .put(`/todo-item/${itemId}/state`)
      .set('Content-Type', 'application/json')
      .set('access-token', users[0])
      .send(JSON.stringify({
        state: 'COMPLETED'
      }))
      .expect(204, function (err, res) {
        should.not.exist(err);
        done(err);
      });
  });

  it('PUT /todo-item/{id=2}/state should return 400 (already completed)', function (done) {
    agent
      .put(`/todo-item/${itemId}/state`)
      .set('Content-Type', 'application/json')
      .set('access-token', users[0])
      .send(JSON.stringify({
        state: 'COMPLETED'
      }))
      .expect(400, function (err, res) {
        should.not.exist(err);
        res.body.should.have.property('error', 'err_already_completed');
        done(err);
      });
  });

  it('GET /todo-item/{id=2} should return 200 (detail of an item)', function (done) {
    agent
      .get(`/todo-item/${itemId}`)
      .set('Content-Type', 'application/json')
      .set('access-token', users[0])
      .expect(200, function (err, res) {
        should.not.exist(err);
        res.body.should.have.property('id', itemId);
        res.body.should.have.property('label', 'pokus');
        res.body.should.have.property('completed', true);
        res.body.should.have.property('completed_at').and.not.equal(null);
        done(err);
      });
  });

  it('PUT /todo-item/{id=2}/state should return 204 (state updated)', function (done) {
    agent
      .put(`/todo-item/${itemId}/state`)
      .set('Content-Type', 'application/json')
      .set('access-token', users[0])
      .send(JSON.stringify({
        state: 'CREATED'
      }))
      .expect(204, function (err, res) {
        should.not.exist(err);
        done(err);
      });
  });

  it('GET /todo-item/{id=2} should return 200 (detail of an item)', function (done) {
    agent
      .get(`/todo-item/${itemId}`)
      .set('Content-Type', 'application/json')
      .set('access-token', users[0])
      .expect(200, function (err, res) {
        should.not.exist(err);
        res.body.should.have.property('id', itemId);
        res.body.should.have.property('label', 'pokus');
        res.body.should.have.property('completed', false);
        res.body.should.have.property('completed_at', null);
        done(err);
      });
  });
});