import { IGetUserRepo } from '$/data/repos';
import { MOCK_USER } from '../../domain/models';

export class MockGetUserRepo implements IGetUserRepo {
  constructor(
    public $get: IGetUserRepo.Result = MOCK_USER
  ) { }

  async get(_uid: IGetUserRepo.Uid): Promise<IGetUserRepo.Result> {
    return this.$get;
  }
}
