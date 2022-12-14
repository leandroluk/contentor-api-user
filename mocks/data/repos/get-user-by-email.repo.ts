import { IGetUserByEmailRepo } from '$/data/repos';
import { MOCK_USER } from '../../domain/models';

export class MockGetUserByEmailRepo implements IGetUserByEmailRepo {
  constructor(
    public $getByEmail: IGetUserByEmailRepo.Result = MOCK_USER
  ) { }

  async getByEmail(_email: IGetUserByEmailRepo.Email): Promise<IGetUserByEmailRepo.Result> {
    return this.$getByEmail;
  }
}
