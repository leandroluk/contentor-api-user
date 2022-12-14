import { IHashPasswordContract } from '$/data/contracts';

export class MockHashPasswordContract implements IHashPasswordContract {
  constructor(
    public $hash: IHashPasswordContract.Result = 'hashed'
  ) { }

  async hash(_password: IHashPasswordContract.Password): Promise<IHashPasswordContract.Result> {
    return this.$hash;
  }
}
