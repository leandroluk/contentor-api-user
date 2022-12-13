import { Snapshot, User } from '$/domain';

export type IHistoryUserRepo = {
  history(uid: IHistoryUserRepo.Uid): Promise<IHistoryUserRepo.Result>;
};
export namespace IHistoryUserRepo {
  export type Uid = User['_uid'];
  export type Type = Snapshot<User>;
  export type Result = Type[];
}
