import { IEnableUserTask } from '$/presentation';
import { MOCK_USER } from '../../domain/models';

export class MockEnableUserTask implements IEnableUserTask {
  constructor(
    public $enable: IEnableUserTask.Result = MOCK_USER
  ) { }

  async enable(_uid: IEnableUserTask.Uid): Promise<IEnableUserTask.Result> {
    return this.$enable;
  }
}
