import { ISearchUserRepo } from '$/data/repos';
import env from '$/env';
import { MOCK_USER } from '../../domain/models';

const { password, ...userWithoutPassword } = MOCK_USER;

export class MockSearchUserRepo implements ISearchUserRepo {
  constructor(
    public $search: ISearchUserRepo.Result = {
      items: [userWithoutPassword],
      limit: env.db.limit,
      offset: 0,
      total: 1
    }
  ) { }

  async search(_query: ISearchUserRepo.Query): Promise<ISearchUserRepo.Result> {
    return this.$search;
  }
}
