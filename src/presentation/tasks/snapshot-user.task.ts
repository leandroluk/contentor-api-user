import { User } from '$/domain';

export type ISnapshotUserTask = {
  snapshot(
    data: ISnapshotUserTask.Data,
    ctor: ISnapshotUserTask.Ctor
  ): Promise<ISnapshotUserTask.Result>;
};
export namespace ISnapshotUserTask {
  export type Data = User;
  export type Ctor = string;
  export type Result = void;
}
