import { IHistoryUserTask } from '$/presentation';
import { inject, registry, singleton } from 'tsyringe';
import { IHistoryUserRepo } from '../repos';

@singleton()
@registry([{ useClass: HistoryUserTask, token: 'IHistoryUserTask' }])
export class HistoryUserTask implements IHistoryUserTask {
  constructor(
    @inject('IHistoryUserRepo')
    private readonly historyUserRepo: IHistoryUserRepo
  ) { }

  async history(uid: IHistoryUserTask.Uid): Promise<IHistoryUserTask.Result> {
    const result = await this.historyUserRepo.history(uid);
    return result;
  }
}
