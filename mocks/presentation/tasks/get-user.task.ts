import { IGetUserTask } from '$/presentation';
import { MOCK_USER } from '../../domain/models';

export class MockGetUserTask implements IGetUserTask {
  constructor(
    public $get: IGetUserTask.Result = MOCK_USER
  ) { }

  async get(_uid: IGetUserTask.Uid): Promise<IGetUserTask.Result> {
    return this.$get;
  }
}
