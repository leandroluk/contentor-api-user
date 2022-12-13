import env from '$/env';
import { DataSource } from 'typeorm';
import { UserEntity } from './entities';

export const typeormDataSource = new DataSource({
  type: 'postgres',
  url: env.db.postgres,
  synchronize: false,
  // logging: env.app.env !== 'production',
  entities: [
    UserEntity
  ]
});
