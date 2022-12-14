import { IHistoryUserTask } from '$/presentation';
import { MOCK_USER } from 'mocks/domain';

export class MockHistoryUserTask implements IHistoryUserTask {
  constructor(
    public $history: IHistoryUserTask.Result = [{
      ...MOCK_USER,
      _ctor: '_ctor',
      _sid: '_sid',
      _ttl: new Date()
    }]
  ) { }

  async history(_uid: IHistoryUserTask.Uid): Promise<IHistoryUserTask.Result> {
    return this.$history;
  }
}
