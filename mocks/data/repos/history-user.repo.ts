import { IHistoryUserRepo } from '$/data';
import { MOCK_USER } from 'mocks/domain';

export class MockHistoryUserRepo implements IHistoryUserRepo {
  constructor(
    public $history: IHistoryUserRepo.Result = [{
      ...MOCK_USER,
      _sid: '_sid',
      _ctor: '_ctor',
      _ttl: new Date()
    }]
  ) { }

  async history(_uid: IHistoryUserRepo.Uid): Promise<IHistoryUserRepo.Result> {
    return this.$history;
  }
}
