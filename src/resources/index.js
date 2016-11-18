import config from 'cfg-loader';

import APIError from '../modules/error';
import log from '../modules/logger';

export default function (app) {
  if (config.server.show_logs) {
    app.use((req, res, next) => {
      let payload = req.body;
      if (req.body && req.body.password) {
        payload = '{hidden content}';
      }
      log.info(`Request to: ( ${req.method} ) ${req.url}`, payload);
      next();
    });
  }

  const resources = require('../modules/resources');
  resources(app);

  app.use('*', (req, res) => {
    log.warn(`Non existing route: ( ${req.method} ) ${req.originalUrl}`);
    res.status(404).send('Route not found.');
  });

  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    if (typeof err === 'number') {
      return res.sendStatus(err);
    } else if (err instanceof APIError) {
      log.error('Error', err, err.stack);
      return res.status(err.status).json({error: err.message});
    } else if (err && err.name === 'SequelizeUniqueConstraintError') {
      const e = err.errors.map((item) => (`${item.path}_already_exist`));
      return res.status(400).json({error: e});
    } else if (err && err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({error: `err_wrong_${err.index}`});
    }
    return res.status(400).json({error: err});
  });
}
