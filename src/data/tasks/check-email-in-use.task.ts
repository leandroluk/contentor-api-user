import '$/infra';
import { ICheckEmailInUseTask } from '$/presentation';
import { inject, registry, singleton } from 'tsyringe';
import { USER_EMAIL_IN_USE } from '../constants';
import { ConflitError } from '../errors';
import { IGetUserByEmailRepo } from '../repos';

@singleton()
@registry([{ useClass: CheckEmailInUseTask, token: 'ICheckEmailInUseTask' }])
export class CheckEmailInUseTask implements ICheckEmailInUseTask {
  constructor(
    @inject('IGetUserByEmailRepo')
    private readonly getUserByEmailRepo: IGetUserByEmailRepo
  ) { }

  async check(
    email: ICheckEmailInUseTask.Email,
    uid?: ICheckEmailInUseTask.Uid
  ): Promise<ICheckEmailInUseTask.Result> {
    const user = await this.getUserByEmailRepo.getByEmail(email);
    if (user && user._uid !== uid) {
      throw new ConflitError(USER_EMAIL_IN_USE);
    }
  }
}
