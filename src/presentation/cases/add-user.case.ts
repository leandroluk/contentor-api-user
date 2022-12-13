import { IAddUserCase } from '$/domain';
import { validate } from '$/validators/validate.decorator';
import { inject, registry, singleton } from 'tsyringe';
import {
  IAddUserTask,
  ICheckEmailInUseTask,
  IPublishUserTask,
  ISnapshotUserTask
} from '../tasks';

@singleton()
@registry([{ useClass: AddUserCase, token: 'IAddUserCase' }])
export class AddUserCase implements IAddUserCase {
  constructor(
    @inject('ICheckEmailInUseTask')
    private readonly checkEmailInUseTask: ICheckEmailInUseTask,
    @inject('IAddUserTask')
    private readonly addUserTask: IAddUserTask,
    @inject('IPublishUserTask')
    private readonly publishUserTask: IPublishUserTask,
    @inject('ISnapshotUserTask')
    private readonly snapshotUserTask: ISnapshotUserTask
  ) { }

  @validate('IAddUserCase.Validator')
  async add(data: IAddUserCase.Data): Promise<IAddUserCase.Result> {
    await this.checkEmailInUseTask.check(data.body.email);
    const user = await this.addUserTask.add(data.body);
    await Promise.all([
      this.publishUserTask.publish(user),
      this.snapshotUserTask.snapshot(user, data.headers.from)
    ]);
    return user;
  }
};
