import { Entity } from '../generics';
import { User } from './user';

export type Authorization = Entity & {
  user_uid: User['_uid'];
  accessToken: string;
  accessTokenExpires: Date;
  refreshToken: string;
  refreshTokenExpires: Date;
};
