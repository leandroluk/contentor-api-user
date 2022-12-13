import packageJson from '../package.json';
const { env: _, cwd } = process;

const env = {
  path: cwd(),
  app: {
    env: _.NODE_ENV ?? 'development',
    name: packageJson.name,
    version: packageJson.version,
    port: Number(_.PORT ?? 3000)
  },
  jwt: {
    secret: (_.JWT_SECRET ?? 'secret').replace(/\\n/g, '\n'),
    algorithm: _.JWT_AUGORITHM ?? 'HS256',
    audience: _.JWT_AUDIENCE ?? 'audience',
    issuer: _.JWT_ISSUER ?? 'issuer',
    accessTTL: Number(_.JWT_ACCESS_TTL ?? 60 * 10), // default 10 minutes
    refreshTTL: Number(_.JWT_REFRESH_TTL ?? 60 * 60 * 24 * 14) // default 14 days
  },
  db: {
    limit: Number(_.DB_LIMIT ?? 50),
    postgres: _.DB_POSTGRES ?? 'postgresql://postgres:postgres@localhost:5432/contentor-api-user',
    elasticsearch: _.DB_ELASTICSEARCH ?? 'http://localhost:9200'
  }
};

export default env;
