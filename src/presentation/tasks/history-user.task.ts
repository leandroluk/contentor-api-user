import { Snapshot, User } from '$/domain';

export type IHistoryUserTask = {
  history(uid: IHistoryUserTask.Uid): Promise<IHistoryUserTask.Result>;
};
export namespace IHistoryUserTask {
  export type Uid = User['_uid'];
  export type Result = Array<Snapshot<User>>;
}
