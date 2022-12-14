import { IEditUserRepo, IGetUserByEmailRepo } from '$/data';
import { typeormDataSource, TypeORMGetUserByEmailRepo } from '$/infra';
import { makeCreateQueryBuilder } from 'tests/helpers';

function makeSut(): {
  sut: TypeORMGetUserByEmailRepo;
  email: IGetUserByEmailRepo.Email;
} {
  const sut = new TypeORMGetUserByEmailRepo();
  const email: IEditUserRepo.Uid = 'email';
  return {
    sut,
    email
  };
};

describe('infra/typeorm/repos/get-user-by-email.repo', () => {
  describe('TypeORMGetUserByEmailRepo.getByEmail', () => {
    it('should return user by email', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      const { sut, email } = makeSut();
      await expect(sut.getByEmail(email)).resolves.toBeDefined();
    });
  });
});
