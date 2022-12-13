import '$/infra';
import { IAddUserTask } from '$/presentation';
import { inject, registry, singleton } from 'tsyringe';
import { ICreateUidContract, IHashPasswordContract } from '../contracts';
import { IAddUserRepo } from '../repos';

@singleton()
@registry([{ useClass: AddUserTask, token: 'IAddUserTask' }])
export class AddUserTask implements IAddUserTask {
  constructor(
    @inject('ICreateUidContract')
    private readonly createUidContract: ICreateUidContract,
    @inject('IHashPasswordContract')
    private readonly hashPasswordContract: IHashPasswordContract,
    @inject('IAddUserRepo')
    private readonly addUserRepo: IAddUserRepo
  ) { }

  async add(data: IAddUserTask.Data): Promise<IAddUserTask.Result> {
    const [_uid, password] = await Promise.all([
      this.createUidContract.create(),
      this.hashPasswordContract.hash(data.password)
    ]);
    const user: IAddUserTask.Result = {
      ...data,
      _uid,
      password,
      _created: new Date(),
      _updated: null,
      _disabled: null
    };
    await this.addUserRepo.add(user);
    return user;
  }
}
