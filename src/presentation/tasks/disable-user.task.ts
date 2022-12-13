import { User } from '$/domain';

export interface IDisableUserTask {
  disable(uid: IDisableUserTask.Uid): Promise<IDisableUserTask.Result>;
};
export namespace IDisableUserTask {
  export type Uid = User['_uid'];
  export type Result = User;
}
