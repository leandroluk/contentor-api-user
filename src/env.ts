import packageJson from '../package.json';
const { env: _, cwd } = process;

const env = {
  path: cwd(),
  app: {
    env: _.NODE_ENV ?? 'development',
    name: packageJson.name,
    version: packageJson.version,
    port: Number(_.PORT ?? 3000),
    servers: _.SERVERS ?? ''
  },
  db: {
    limit: Number(_.DB_LIMIT ?? 50),
    postgres: _.DB_POSTGRES ?? 'postgresql://postgres:postgres@localhost:5432/contentor-api-user',
    elasticsearch: _.DB_ELASTICSEARCH ?? 'http://localhost:9200'
  }
};

export default env;
