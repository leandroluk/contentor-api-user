import { IAddUserRepo } from '$/data/repos';
import { registry, singleton } from 'tsyringe';
import { typeormDataSource } from '../data-source';
import { UserEntity } from '../entities';

@singleton()
@registry([{ useClass: TypeORMAddUserRepo, token: 'IAddUserRepo' }])
export class TypeORMAddUserRepo implements IAddUserRepo {
  async add(data: IAddUserRepo.Data): Promise<IAddUserRepo.Result> {
    await typeormDataSource
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values(data)
      .execute();
  }
}
