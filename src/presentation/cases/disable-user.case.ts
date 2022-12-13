import { IDisableUserCase } from '$/domain';
import { validate } from '$/validators';
import { inject, registry, singleton } from 'tsyringe';
import { IDisableUserTask, IPublishUserTask, ISnapshotUserTask } from '../tasks';

@singleton()
@registry([{ useClass: DisableUserCase, token: 'IDisableUserCase' }])
export class DisableUserCase implements IDisableUserCase {
  constructor(
    @inject('IDisableUserTask')
    private readonly disableUserTask: IDisableUserTask,
    @inject('IPublishUserTask')
    private readonly publishUserTask: IPublishUserTask,
    @inject('ISnapshotUserTask')
    private readonly snapshotUserTask: ISnapshotUserTask
  ) { }

  @validate('IDisableUserCase.Validator')
  async disable(data: IDisableUserCase.Data): Promise<IDisableUserCase.Result> {
    const user = await this.disableUserTask.disable(data.params._uid);
    await Promise.all([
      this.publishUserTask.publish(user),
      this.snapshotUserTask.snapshot(user, data.headers.from)
    ]);
  }
}
