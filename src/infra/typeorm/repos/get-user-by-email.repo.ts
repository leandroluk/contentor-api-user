import { IGetUserByEmailRepo } from '$/data/repos';
import { registry, singleton } from 'tsyringe';
import { typeormDataSource } from '../data-source';
import { UserEntity } from '../entities';

@singleton()
@registry([{ useClass: TypeORMGetUserByEmailRepo, token: 'IGetUserByEmailRepo' }])
export class TypeORMGetUserByEmailRepo implements IGetUserByEmailRepo {
  async getByEmail(email: IGetUserByEmailRepo.Email): Promise<IGetUserByEmailRepo.Result> {
    const doc = await typeormDataSource
      .createQueryBuilder()
      .from(UserEntity, 'u')
      .select('u')
      .where('u.email = :email', { email })
      .getOne();
    return doc;
  }
}
