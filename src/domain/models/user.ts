import { Entity } from '../generics';

export type User = Entity & {
  displayName: string;
  email: string;
  password: string;
};
