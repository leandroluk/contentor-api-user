import env from '$/env';
import { ISearchUserTask } from '$/presentation';
import { MOCK_USER } from '../../domain/models';

const { password, ...userWithoutPassword } = MOCK_USER;

export class MockSearchUserTask implements ISearchUserTask {
  constructor(
    public $search: ISearchUserTask.Result = {
      items: [userWithoutPassword],
      limit: env.db.limit,
      offset: 0,
      total: 1
    }
  ) { }

  async search(_query: ISearchUserTask.Query): Promise<ISearchUserTask.Result> {
    return this.$search;
  }
}
