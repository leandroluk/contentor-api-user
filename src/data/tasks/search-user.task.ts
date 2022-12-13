import { ISearchUserTask } from '$/presentation';
import { inject, registry, singleton } from 'tsyringe';
import { ISearchUserRepo } from '../repos';

@singleton()
@registry([{ useClass: SearchUserTask, token: 'ISearchUserTask' }])
export class SearchUserTask implements ISearchUserTask {
  constructor(
    @inject('ISearchUserRepo')
    private readonly searchUserRepo: ISearchUserRepo
  ) { }

  async search(query: ISearchUserTask.Query): Promise<ISearchUserTask.Result> {
    const result = await this.searchUserRepo.search(query);
    return result;
  }
}
