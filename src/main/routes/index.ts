import { elasticsearchHelper } from '$/infra';
import { typeormDataSource } from '$/infra/typeorm';
import docs from '$/main/docs';
import { Router } from 'express';
import swagger from 'swagger-ui-express';
import apiRoute from './api';

const routes = Router();

routes.use('/api', apiRoute);

routes.use('/docs', swagger.serve, swagger.setup(docs));

routes.get('/health', async (_, res) => {
  await Promise.all([
    typeormDataSource.query('SELECT 1'),
    elasticsearchHelper.instance.ping()
  ]);
  res.sendStatus(200);
});

export default routes;
