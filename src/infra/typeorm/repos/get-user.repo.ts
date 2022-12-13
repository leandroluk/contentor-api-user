import { IGetUserRepo } from '$/data/repos';
import { registry, singleton } from 'tsyringe';
import { typeormDataSource } from '../data-source';
import { UserEntity } from '../entities';

@singleton()
@registry([{ useClass: TypeORMGetUserRepo, token: 'IGetUserRepo' }])
export class TypeORMGetUserRepo implements IGetUserRepo {
  async get(uid: IGetUserRepo.Uid): Promise<IGetUserRepo.Result> {
    const doc = await typeormDataSource
      .createQueryBuilder()
      .from(UserEntity, 'u')
      .select('u')
      .where('u._uid = :uid', { uid })
      .getOne();
    return doc;
  }
}
