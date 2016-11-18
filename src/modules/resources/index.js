import fs from 'fs';
import path from 'path';

import log from '../logger';

export default (app) => {
  const resourcePath = path.join(__dirname, '..', '..', 'resources');
  log.info(`Loading resources from path: '${resourcePath}'`);
  const folders = fs.readdirSync(resourcePath);
  let stat;
  folders.forEach((f) => {
    stat = fs.statSync(path.join(resourcePath, f));
    if (stat.isDirectory()) {
      module.exports[f] = {};

      if (fs.existsSync(path.join(resourcePath, f, 'route.js'))) {
        const route = require(path.join(resourcePath, f, 'route.js'));
        log.info(`Resource ${f} - route loaded`);
        app.use(route);
      }
    }
  });
};
