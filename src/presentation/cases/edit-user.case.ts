import { IEditUserCase } from '$/domain';
import { validate } from '$/validators';
import { inject, registry, singleton } from 'tsyringe';
import {
  ICheckEmailInUseTask,
  IEditUserTask,
  IPublishUserTask,
  ISnapshotUserTask
} from '../tasks';

@singleton()
@registry([{ useClass: EditUserCase, token: 'IEditUserCase' }])
export class EditUserCase implements IEditUserCase {
  constructor(
    @inject('ICheckEmailInUseTask')
    private readonly checkEmailInUseTask: ICheckEmailInUseTask,
    @inject('IEditUserTask')
    private readonly editUserTask: IEditUserTask,
    @inject('IPublishUserTask')
    private readonly publishUserTask: IPublishUserTask,
    @inject('ISnapshotUserTask')
    private readonly snapshotUserTask: ISnapshotUserTask
  ) { }

  @validate('IEditUserCase.Validator')
  async edit(data: IEditUserCase.Data): Promise<IEditUserCase.Result> {
    if (data.body.email) {
      await this.checkEmailInUseTask.check(data.body.email, data.params._uid);
    }
    const user = await this.editUserTask.edit(data.params._uid, data.body);
    await Promise.all([
      this.publishUserTask.publish(user),
      this.snapshotUserTask.snapshot(user, data.headers.from)
    ]);
    return user;
  }
};
