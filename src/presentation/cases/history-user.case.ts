import { IHistoryUserCase } from '$/domain';
import { validate } from '$/validators';
import { inject, registry, singleton } from 'tsyringe';
import { IHistoryUserTask } from '../tasks';

@singleton()
@registry([{ useClass: HistoryUserCase, token: 'IHistoryUserCase' }])
export class HistoryUserCase implements IHistoryUserCase {
  constructor(
    @inject('IHistoryUserTask')
    private readonly historyUserTask: IHistoryUserTask
  ) { }

  @validate('IHistoryUserCase.Validator')
  async history(data: IHistoryUserCase.Data): Promise<IHistoryUserCase.Result> {
    const result = await this.historyUserTask.history(data.params._uid);
    return result;
  }
}
