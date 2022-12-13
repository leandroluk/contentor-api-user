import { IHashPasswordContract } from '$/data/contracts';
import crypto from 'crypto';
import { registry, singleton } from 'tsyringe';

@singleton()
@registry([{ useClass: HashPasswordAdapter, token: 'IHashPasswordContract' }])
export class HashPasswordAdapter implements IHashPasswordContract {
  async hash(password: IHashPasswordContract.Password): Promise<IHashPasswordContract.Result> {
    const key = crypto.randomBytes(8).toString('hex');
    const hashed = crypto.createHmac('sha256', key).update(password).digest('hex');
    return key + hashed;
  }
}
