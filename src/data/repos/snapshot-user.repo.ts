import { Snapshot, User } from '$/domain';

export type ISnapshotUserRepo = {
  snapshot(data: ISnapshotUserRepo.Data): Promise<ISnapshotUserRepo.Result>;
};
export namespace ISnapshotUserRepo {
  export type Data = Snapshot<User>;
  export type Result = void;
}
