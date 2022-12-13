import { IEditUserRepo } from '$/data/repos';
import { registry, singleton } from 'tsyringe';
import { typeormDataSource } from '../data-source';
import { UserEntity } from '../entities';

@singleton()
@registry([{ useClass: TypeORMEditUserRepo, token: 'IEditUserRepo' }])
export class TypeORMEditUserRepo implements IEditUserRepo {
  async edit(
    uid: IEditUserRepo.Uid,
    changes: IEditUserRepo.Changes
  ): Promise<IEditUserRepo.Result> {
    await typeormDataSource
      .createQueryBuilder()
      .update(UserEntity)
      .set(changes)
      .where('_uid = :_uid', { _uid: uid })
      .execute();
  }
}
