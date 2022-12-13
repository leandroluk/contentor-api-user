import { ISearchUserCase } from '$/domain';
import { validate } from '$/validators';
import { inject, registry, singleton } from 'tsyringe';
import { ISearchUserTask } from '../tasks';

@singleton()
@registry([{ useClass: SearchUserCase, token: 'ISearchUserCase' }])
export class SearchUserCase implements ISearchUserCase {
  constructor(
    @inject('ISearchUserTask')
    private readonly searchUserTask: ISearchUserTask
  ) { }

  @validate('ISearchUserCase.Validator')
  async search(data: ISearchUserCase.Data): Promise<ISearchUserCase.Result> {
    const result = await this.searchUserTask.search(data.body);
    return result;
  }
}
