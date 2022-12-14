import {
  ConflitError,
  DisableUserTask,
  NotFoundError,
  USER_IS_DISABLED,
  USER_NOT_FOUND
} from '$/data';
import { IDisableUserTask } from '$/presentation';
import { MockEditUserRepo, MockGetUserRepo } from 'mocks';

function makeSut(): {
  getUserRepo: MockGetUserRepo;
  editUserRepo: MockEditUserRepo;
  sut: DisableUserTask;
  uid: IDisableUserTask.Uid;
} {
  const getUserRepo = new MockGetUserRepo();
  const editUserRepo = new MockEditUserRepo();
  const sut = new DisableUserTask(
    getUserRepo,
    editUserRepo
  );
  const uid: IDisableUserTask.Uid = 'uid';
  return {
    getUserRepo,
    editUserRepo,
    sut,
    uid
  };
}

describe('data/tasks/disable-user.task', () => {
  describe('DisableUserTask.disable', () => {
    it('should throw if getUserRepo throws', async () => {
      const { getUserRepo, sut, uid } = makeSut();
      jest.spyOn(getUserRepo, 'get').mockRejectedValue(new Error());
      await expect(sut.disable(uid)).rejects.toThrow();
    });

    it('should throw if getUserRepo return falsy', async () => {
      const { getUserRepo, sut, uid } = makeSut();
      jest.spyOn(getUserRepo, 'get').mockResolvedValue(null);
      await expect(sut.disable(uid)).rejects.toThrow(new NotFoundError(USER_NOT_FOUND));
    });

    it('should throw if getUserRepo return disabled user', async () => {
      const { getUserRepo, sut, uid } = makeSut();
      jest.spyOn(getUserRepo, 'get').mockResolvedValue({ _disabled: new Date() } as any);
      await expect(sut.disable(uid)).rejects.toThrow(new ConflitError(USER_IS_DISABLED));
    });

    it('should throw if editUserRepo throws', async () => {
      const { editUserRepo, sut, uid } = makeSut();
      jest.spyOn(editUserRepo, 'edit').mockRejectedValue(new Error());
      await expect(sut.disable(uid)).rejects.toThrow();
    });

    it('should return if disable user', async () => {
      const { sut, uid } = makeSut();
      await expect(sut.disable(uid)).resolves.toBeDefined();
    });
  });
});
