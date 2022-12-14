import { IAddUserTask } from '$/presentation';
import { MOCK_USER } from '../../domain/models';

export class MockAddUserTask implements IAddUserTask {
  constructor(
    public $add: IAddUserTask.Result = MOCK_USER
  ) { }

  async add(_data: IAddUserTask.Data): Promise<IAddUserTask.Result> {
    return this.$add;
  }
}
