import { IEditUserRepo, IGetUserRepo } from '$/data';
import { typeormDataSource, TypeORMGetUserRepo } from '$/infra';
import { makeCreateQueryBuilder } from 'tests/helpers';

function makeSut(): {
  sut: TypeORMGetUserRepo;
  uid: IGetUserRepo.Uid;
} {
  const sut = new TypeORMGetUserRepo();
  const uid: IEditUserRepo.Uid = 'uid';
  return {
    sut,
    uid
  };
};

describe('infra/typeorm/repos/get-user.repo', () => {
  describe('TypeORMGetUserRepo.get', () => {
    it('should return user', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      const { sut, uid } = makeSut();
      await expect(sut.get(uid)).resolves.toBeDefined();
    });
  });
});
