import { User } from '$/domain';

export interface IGetUserTask {
  get(uid: IGetUserTask.Uid): Promise<IGetUserTask.Result>;
};
export namespace IGetUserTask {
  export type Uid = User['_uid'];
  export type Result = User;
}
