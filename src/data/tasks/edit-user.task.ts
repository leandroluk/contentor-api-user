import { NotFoundError, UnprocessableError } from '$/data';
import { IEditUserTask } from '$/presentation';
import { inject, registry, singleton } from 'tsyringe';
import { USER_IS_DISABLED, USER_NOT_FOUND } from '../constants';
import { IHashPasswordContract } from '../contracts';
import { IEditUserRepo, IGetUserRepo } from '../repos';

@singleton()
@registry([{ useClass: EditUserTask, token: 'IEditUserTask' }])
export class EditUserTask implements IEditUserTask {
  constructor(
    @inject('IGetUserRepo')
    private readonly getUserRepo: IGetUserRepo,
    @inject('IHashPasswordContract')
    private readonly hashPasswordContract: IHashPasswordContract,
    @inject('IEditUserRepo')
    private readonly editUserRepo: IEditUserRepo
  ) { }

  async edit(
    uid: IEditUserTask.Uid,
    changes: IEditUserTask.Changes
  ): Promise<IEditUserTask.Result> {
    const user = await this.getUserRepo.get(uid);
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    } else if (user._disabled) {
      throw new UnprocessableError(USER_IS_DISABLED);
    }
    const editedUser = {
      ...changes,
      _updated: new Date()
    };
    if (changes.password) {
      editedUser.password = await this.hashPasswordContract.hash(changes.password);
    }
    await this.editUserRepo.edit(uid, editedUser);
    return { ...user, ...editedUser };
  }
}
