import { ISnapshotUserTask } from '$/presentation';
import { inject, registry, singleton } from 'tsyringe';
import { ICreateUidContract } from '../contracts';
import { ISnapshotUserRepo } from '../repos';

@singleton()
@registry([{ useClass: SnapshotUserTask, token: 'ISnapshotUserTask' }])
export class SnapshotUserTask implements ISnapshotUserTask {
  constructor(
    @inject('ICreateUidContract')
    private readonly createUidContract: ICreateUidContract,
    @inject('ISnapshotUserRepo')
    private readonly snapshotUserRepo: ISnapshotUserRepo
  ) { }

  async snapshot(
    data: ISnapshotUserTask.Data,
    ctor: ISnapshotUserTask.Ctor
  ): Promise<ISnapshotUserTask.Result> {
    await this.snapshotUserRepo.snapshot({
      ...data,
      _ctor: ctor,
      _sid: await this.createUidContract.create(),
      _ttl: new Date()
    });
  }
}
