import {
  EditUserTask,
  NotFoundError,
  UnprocessableError,
  USER_IS_DISABLED,
  USER_NOT_FOUND
} from '$/data';
import { IEditUserTask } from '$/presentation';
import { MockEditUserRepo, MockGetUserRepo, MockHashPasswordContract } from 'mocks';

function makeSut(): {
  getUserRepo: MockGetUserRepo;
  hashPasswordContract: MockHashPasswordContract;
  editUserRepo: MockEditUserRepo;
  sut: EditUserTask;
  uid: IEditUserTask.Uid,
  changes: IEditUserTask.Changes;
} {
  const getUserRepo = new MockGetUserRepo();
  const hashPasswordContract = new MockHashPasswordContract();
  const editUserRepo = new MockEditUserRepo();
  const sut = new EditUserTask(
    getUserRepo,
    hashPasswordContract,
    editUserRepo
  );
  const uid: IEditUserTask.Uid = 'uid';
  const changes: IEditUserTask.Changes = {};
  return {
    getUserRepo,
    hashPasswordContract,
    editUserRepo,
    sut,
    uid,
    changes
  };
}

describe('data/tasks/edit-user.task', () => {
  describe('EditUserTask.edit', () => {
    it('should throw if getUserRepo throws', async () => {
      const { getUserRepo, sut, uid, changes } = makeSut();
      jest.spyOn(getUserRepo, 'get').mockRejectedValue(new Error());
      await expect(sut.edit(uid, changes)).rejects.toThrow();
    });

    it('should throw if getUserRepo return falsy', async () => {
      const { getUserRepo, sut, uid, changes } = makeSut();
      jest.spyOn(getUserRepo, 'get').mockResolvedValue(null);
      await expect(sut.edit(uid, changes)).rejects.toThrow(new NotFoundError(USER_NOT_FOUND));
    });

    it('should throw if getUserRepo return disabled user', async () => {
      const { getUserRepo, sut, uid, changes } = makeSut();
      jest.spyOn(getUserRepo, 'get').mockResolvedValue({ _disabled: new Date() } as any);
      await expect(sut.edit(uid, changes)).rejects.toThrow(new UnprocessableError(USER_IS_DISABLED));
    });

    it('should throw if hashPasswordContract throws', async () => {
      const { hashPasswordContract, sut, uid, changes } = makeSut();
      jest.spyOn(hashPasswordContract, 'hash').mockRejectedValue(new Error());
      await expect(sut.edit(uid, { ...changes, password: '123' })).rejects.toThrow();
    });

    it('should throw if editUserRepoThrows throws', async () => {
      const { editUserRepo, sut, uid, changes } = makeSut();
      jest.spyOn(editUserRepo, 'edit').mockRejectedValue(new Error());
      await expect(sut.edit(uid, changes)).rejects.toThrow();
    });

    it('should return edited user with _updated field set if success', async () => {
      const { sut, uid, changes } = makeSut();
      const result = await sut.edit(uid, changes);
      expect(result._updated).toBeDefined();
    });
  });
});
