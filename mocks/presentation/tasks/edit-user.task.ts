import { IEditUserTask } from '$/presentation';
import { MOCK_USER } from '../../domain/models';

export class MockEditUserTask implements IEditUserTask {
  constructor(
    public $edit: IEditUserTask.Result = MOCK_USER
  ) { }

  async edit(
    _uid: IEditUserTask.Uid,
    _changes: IEditUserTask.Changes
  ): Promise<IEditUserTask.Result> {
    return this.$edit;
  }
}
