import { ICreateUidContract } from '$/data/contracts';

export class MockCreateUidContract implements ICreateUidContract {
  constructor(
    public $create: ICreateUidContract.Result = 'uid'
  ) { }

  async create(): Promise<ICreateUidContract.Result> {
    return this.$create;
  }
}
