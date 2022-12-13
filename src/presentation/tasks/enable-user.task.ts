import { User } from '$/domain';

export interface IEnableUserTask {
  enable(uid: IEnableUserTask.Uid): Promise<IEnableUserTask.Result>;
};
export namespace IEnableUserTask {
  export type Uid = User['_uid'];
  export type Result = User;
}
