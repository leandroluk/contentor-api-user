import { IGetUserCase } from '$/domain';
import { validate } from '$/validators';
import { inject, registry, singleton } from 'tsyringe';
import { IGetUserTask } from '../tasks';

@singleton()
@registry([{ useClass: GetUserCase, token: 'IGetUserCase' }])
export class GetUserCase implements IGetUserCase {
  constructor(
    @inject('IGetUserTask')
    private readonly getUserTask: IGetUserTask
  ) { }

  @validate('IGetUserCase.Validator')
  async get(data: IGetUserCase.Data): Promise<IGetUserCase.Result> {
    const user = await this.getUserTask.get(data.params._uid);
    return user;
  }
};
