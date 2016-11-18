import bunyan from 'bunyan';

const logger = bunyan.createLogger({
  name: 'Default'
});

export default logger;
