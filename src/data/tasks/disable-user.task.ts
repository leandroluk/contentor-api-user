import { ConflitError, NotFoundError } from '$/data';
import { IDisableUserTask } from '$/presentation';
import { inject, registry, singleton } from 'tsyringe';
import { USER_IS_DISABLED, USER_NOT_FOUND } from '../constants';
import { IEditUserRepo, IGetUserRepo } from '../repos';

@singleton()
@registry([{ useClass: DisableUserTask, token: 'IDisableUserTask' }])
export class DisableUserTask implements IDisableUserTask {
  constructor(
    @inject('IGetUserRepo')
    private readonly getUserRepo: IGetUserRepo,
    @inject('IEditUserRepo')
    private readonly editUserRepo: IEditUserRepo
  ) { }

  async disable(uid: IDisableUserTask.Uid): Promise<IDisableUserTask.Result> {
    const user = await this.getUserRepo.get(uid);
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    } else if (user._disabled) {
      throw new ConflitError(USER_IS_DISABLED);
    }
    const changes = {
      _updated: new Date(),
      _disabled: new Date()
    };
    await this.editUserRepo.edit(uid, changes);
    return { ...user, ...changes };
  }
}
