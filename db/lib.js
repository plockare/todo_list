const path = require('path');
const fs = require('fs');
const async = require('async');
const config = require('cfg-loader').default;
const exec = require('child_process').exec;
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  multipleStatements: true
});

const baseCmd = `flyway -user=${config.database.user} -password=${config.database.password} -url=jdbc:mysql://${config.database.host}/${config.database.database} -schemas=${config.database.database}`;
const locations = `-locations=filesystem:${__dirname}/sql,filesystem:${__dirname}/`;

const internals = {};

internals._sqldir = `${__dirname}/sql`;

internals._runfile = function _runfile(s, callback) {
  console.log('db.schema');
  db.query(`CREATE DATABASE IF NOT EXISTS ${config.database.database}`, (err) => {
    if (err) return callback(err);
    exec(`${baseCmd} ${locations}${s} migrate`, (err, stdout) => {
      console.log(stdout);
      callback(err);
    });
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
  exec(`${baseCmd} clean`, cb);
};

export default internals;
