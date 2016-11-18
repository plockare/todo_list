var config = require('cfg-loader');
config.load(__dirname + '/../src/config');
var lib = require('./lib');

var method = process.argv[2];
if ({}.hasOwnProperty.call(lib, method)) {
  lib[method]((err) => {
    if (err) {
      throw err;
    }
    process.exit(0);
  });
} else {
  console.log(`invalid method specified - ${method}`);
  process.exit(1);
}