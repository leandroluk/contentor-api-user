import { IAddUserRepo } from '$/data/repos';

export class MockAddUserRepo implements IAddUserRepo {
  async add(_data: IAddUserRepo.Data): Promise<IAddUserRepo.Result> {
  }
}
