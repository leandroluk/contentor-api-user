import { IEnableUserCase } from '$/domain';
import { validate } from '$/validators';
import { inject, registry, singleton } from 'tsyringe';
import { IEnableUserTask, IPublishUserTask, ISnapshotUserTask } from '../tasks';

@singleton()
@registry([{ useClass: EnableUserCase, token: 'IEnableUserCase' }])
export class EnableUserCase implements IEnableUserCase {
  constructor(
    @inject('IEnableUserTask')
    private readonly enableUserTask: IEnableUserTask,
    @inject('IPublishUserTask')
    private readonly publishUserTask: IPublishUserTask,
    @inject('ISnapshotUserTask')
    private readonly snapshotUserTask: ISnapshotUserTask
  ) { }

  @validate('IEnableUserCase.Validator')
  async enable(data: IEnableUserCase.Data): Promise<IEnableUserCase.Result> {
    const user = await this.enableUserTask.enable(data.params._uid);
    await Promise.all([
      this.publishUserTask.publish(user),
      this.snapshotUserTask.snapshot(user, data.headers.from)
    ]);
    return user;
  }
};
