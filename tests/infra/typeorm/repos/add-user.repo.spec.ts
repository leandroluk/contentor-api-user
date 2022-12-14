import { IAddUserRepo } from '$/data';
import { TypeORMAddUserRepo, typeormDataSource } from '$/infra';
import { makeCreateQueryBuilder } from 'tests/helpers';

function makeSut(): {
  sut: TypeORMAddUserRepo;
  data: IAddUserRepo.Data;
} {
  const sut = new TypeORMAddUserRepo();
  const data: IAddUserRepo.Data = {
    _uid: '_uid',
    _created: new Date(),
    _updated: null,
    _disabled: null,
    displayName: 'displayName',
    email: 'email',
    password: 'password'
  };
  return {
    sut,
    data
  };
};

describe('infra/typeorm/repos/add-user.repo', () => {
  describe('TypeORMAddUserRepo.add', () => {
    it('should add user', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      const { sut, data } = makeSut();
      await expect(sut.add(data)).resolves.toBeUndefined();
    });
  });
});
