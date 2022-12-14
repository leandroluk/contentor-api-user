import { IEditUserRepo } from '$/data/repos';

export class MockEditUserRepo implements IEditUserRepo {
  async edit(
    _uid: IEditUserRepo.Uid,
    _changes: IEditUserRepo.Changes
  ): Promise<IEditUserRepo.Result> {
  }
}
