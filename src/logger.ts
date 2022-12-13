import ecsFormat from '@elastic/ecs-winston-format';
import winston from 'winston';

import env from './env';

const logger = winston.createLogger({
  level: 'info',
  format: ecsFormat({ convertReqRes: true }),
  defaultMeta: { app: env.app },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: '.logs/log.json',
      level: 'debug'
    })
  ]
});

export default logger;
