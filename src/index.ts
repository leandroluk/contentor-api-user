import 'reflect-metadata';
//
import '$/data';
import { elasticsearchHelper, typeormDataSource } from '$/infra';
import '$/presentation';
import '$/validators';
import env from './env';
import logger from './logger';
import app from './main';

Promise.all([
  typeormDataSource.initialize(),
  elasticsearchHelper.connect()
]).then(() => {
  app.listen(env.app.port, () => {
    logger.info(`running on port ${env.app.port}`);
  });
}).catch((e: Error) => {
  logger.error(e);
  process.exit(1);
});

