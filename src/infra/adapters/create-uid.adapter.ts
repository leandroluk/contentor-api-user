import { ICreateUidContract } from '$/data/contracts';
import crypto from 'crypto';
import { registry, singleton } from 'tsyringe';

@singleton()
@registry([{ useClass: CreateUidAdapter, token: 'ICreateUidContract' }])
export class CreateUidAdapter implements ICreateUidContract {
  async create(): Promise<ICreateUidContract.Result> {
    const uid = crypto.randomUUID();
    return uid;
  }
}
