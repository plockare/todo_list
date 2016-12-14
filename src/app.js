import cookieParser from 'cookie-parser';
import express from 'express';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import config, { load as configLoad } from 'cfg-loader';
import path from 'path';
import validation from './modules/validation';
import resources from './resources';
import policy from './modules/policy';
import modelManager from './modules/modelManager';
import error, {messages as errorMessages} from './modules/error';
import logger from './modules/logger';

configLoad(path.join(__dirname, 'config'));

const app = express();
app.set('port', config.server.port);
app.use(expressValidator(validation.options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

modelManager.init(config, logger, path.join(__dirname, 'resources'));
policy.init(config, modelManager, error, errorMessages);

if (process.env.NODE_ENV === 'dev') {
  //CORS middleware
  const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, access-token');
    next();
  };
  app.use(allowCrossDomain);
}

resources(app);

export default app;
