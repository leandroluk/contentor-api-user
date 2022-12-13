import { Unique } from './unique';

export type Snapshot<T extends Unique> = T & {
  _sid: string;
  _ctor: string;
  _ttl: Date;
};
