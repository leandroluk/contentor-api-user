import { User } from '$/domain/models';
import { SortMap } from './types';

export const userSortMap: SortMap<User> = {
  _uid: '_uid.keyword',
  _created: '_created',
  _disabled: '_disabled',
  _updated: '_updated',
  displayName: 'displayName',
  email: 'email.keyword',
  password: 'password.keyword'
};
