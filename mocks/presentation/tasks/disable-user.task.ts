import { IDisableUserTask } from '$/presentation';
import { MOCK_USER } from 'mocks/domain';

export class MockDisableUserTask implements IDisableUserTask {
  constructor(
    public $disable: IDisableUserTask.Result = MOCK_USER
  ) { }

  async disable(_uid: IDisableUserTask.Uid): Promise<IDisableUserTask.Result> {
    return this.$disable;
  }
}
