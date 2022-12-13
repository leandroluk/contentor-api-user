import { NotFoundError } from '$/data';
import { IGetUserTask } from '$/presentation';
import { inject, registry, singleton } from 'tsyringe';
import { USER_NOT_FOUND } from '../constants';
import { IGetUserRepo } from '../repos';

@singleton()
@registry([{ useClass: GetUserTask, token: 'IGetUserTask' }])
export class GetUserTask implements IGetUserTask {
  constructor(
    @inject('IGetUserRepo')
    private readonly getUserRepo: IGetUserRepo
  ) { }

  async get(uid: IGetUserTask.Uid): Promise<IGetUserTask.Result> {
    const user = await this.getUserRepo.get(uid);
    if (!user || user._disabled) {
      throw new NotFoundError(USER_NOT_FOUND);
    }
    return user;
  }
}
