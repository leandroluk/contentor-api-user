import { ISnapshotUserTask } from '$/presentation';

export class MockSnapshotUserTask implements ISnapshotUserTask {
  async snapshot(
    _data: ISnapshotUserTask.Data,
    _ctor: ISnapshotUserTask.Ctor
  ): Promise<ISnapshotUserTask.Result> {
  }
}
