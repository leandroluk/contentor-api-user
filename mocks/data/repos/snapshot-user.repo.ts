import { ISnapshotUserRepo } from '$/data';

export class MockSnapshotUserRepo implements ISnapshotUserRepo {
  async snapshot(_data: ISnapshotUserRepo.Data): Promise<ISnapshotUserRepo.Result> {
  }
}
