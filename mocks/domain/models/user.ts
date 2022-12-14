import { User } from '$/domain';

export const MOCK_USER: User = {
  _uid: '_uid',
  _created: new Date(),
  _updated: null,
  _disabled: null,
  displayName: 'displayName',
  email: 'email',
  password: 'password'
};
