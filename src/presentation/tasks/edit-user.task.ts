import { Entity, User } from '$/domain';

export interface IEditUserTask {
  edit(uid: IEditUserTask.Uid, changes: IEditUserTask.Changes): Promise<IEditUserTask.Result>;
};
export namespace IEditUserTask {
  export type Uid = User['_uid'];
  export type Changes = Partial<Omit<User, keyof Entity>>;
  export type Result = User;
}
