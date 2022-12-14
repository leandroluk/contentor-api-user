import { IPublishUserTask } from '$/presentation';

export class MockPublishUserTask implements IPublishUserTask {
  async publish(_data: IPublishUserTask.Data): Promise<IPublishUserTask.Result> {
  }
}
