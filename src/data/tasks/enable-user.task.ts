import { ConflitError, NotFoundError } from '$/data';
import { IEnableUserTask } from '$/presentation';
import { inject, registry, singleton } from 'tsyringe';
import { USER_IS_ENABLED, USER_NOT_FOUND } from '../constants';
import { IEditUserRepo, IGetUserRepo } from '../repos';

@singleton()
@registry([{ useClass: EnableUserTask, token: 'IEnableUserTask' }])
export class EnableUserTask implements IEnableUserTask {
  constructor(
    @inject('IGetUserRepo')
    private readonly getUserRepo: IGetUserRepo,
    @inject('IEditUserRepo')
    private readonly editUserRepo: IEditUserRepo
  ) { }

  async enable(uid: IEnableUserTask.Uid): Promise<IEnableUserTask.Result> {
    const user = await this.getUserRepo.get(uid);
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    } else if (!user._disabled) {
      throw new ConflitError(USER_IS_ENABLED);
    }
    const enabledUser = {
      _updated: new Date(),
      _disabled: null
    };
    await this.editUserRepo.edit(uid, enabledUser);
    return { ...user, ...enabledUser };
  }
}
