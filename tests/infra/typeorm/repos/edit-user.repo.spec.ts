import { IEditUserRepo } from '$/data';
import { typeormDataSource, TypeORMEditUserRepo } from '$/infra';
import { makeCreateQueryBuilder } from 'tests/helpers';

function makeSut(): {
  sut: TypeORMEditUserRepo;
  uid: IEditUserRepo.Uid;
  changes: IEditUserRepo.Changes;
} {
  const sut = new TypeORMEditUserRepo();
  const uid: IEditUserRepo.Uid = 'uid';
  const changes: IEditUserRepo.Changes = {
    _created: new Date(),
    _updated: new Date(),
    _disabled: null,
    displayName: 'displayName',
    email: 'email',
    password: 'password'
  };
  return {
    sut,
    uid,
    changes
  };
};

describe('infra/typeorm/repos/edit-user.repo', () => {
  describe('TypeORMEditUserRepo.edit', () => {
    it('should edit user', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      const { sut, uid, changes } = makeSut();
      await expect(sut.edit(uid, changes)).resolves.toBeUndefined();
    });
  });
});
