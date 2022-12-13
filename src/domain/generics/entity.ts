import { Unique } from './unique';

export type Entity = Unique & {
  _created: Date;
  _updated?: Date;
  _disabled?: Date;
};
