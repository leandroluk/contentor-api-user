import { ICheckEmailInUseTask } from '$/presentation';

export class MockCheckEmailInUseTask implements ICheckEmailInUseTask {
  async check(
    _email: ICheckEmailInUseTask.Email,
    _uid: ICheckEmailInUseTask.Uid
  ): Promise<ICheckEmailInUseTask.Result> {
  }
}
