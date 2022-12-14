import {
  GetUserTask,
  NotFoundError,
  USER_NOT_FOUND
} from '$/data';
import { IGetUserTask } from '$/presentation';
import { MockGetUserRepo } from 'mocks';

function makeSut(): {
  getUserRepo: MockGetUserRepo;
  sut: GetUserTask;
  uid: IGetUserTask.Uid;
} {
  const getUserRepo = new MockGetUserRepo();
  const sut = new GetUserTask(
    getUserRepo
  );
  const uid: IGetUserTask.Uid = 'uid';
  return {
    getUserRepo,
    sut,
    uid
  };
}

describe('data/tasks/get-user.task', () => {
  describe('GetUserTask.get', () => {
    it('should throw if getUserRepo throws', async () => {
      const { getUserRepo, sut, uid } = makeSut();
      jest.spyOn(getUserRepo, 'get').mockRejectedValue(new Error());
      await expect(sut.get(uid)).rejects.toThrow();
    });

    it('should throw if getUserRepo return falsy', async () => {
      const { getUserRepo, sut, uid } = makeSut();
      jest.spyOn(getUserRepo, 'get').mockResolvedValue(null);
      await expect(sut.get(uid)).rejects.toThrow(new NotFoundError(USER_NOT_FOUND));
    });

    it('should throw if getUserRepo return disabled user', async () => {
      const { getUserRepo, sut, uid } = makeSut();
      jest.spyOn(getUserRepo, 'get').mockResolvedValue({ _disabled: new Date() } as any);
      await expect(sut.get(uid)).rejects.toThrow(new NotFoundError(USER_NOT_FOUND));
    });

    it('should return user', async () => {
      const { sut, uid } = makeSut();
      await expect(sut.get(uid)).resolves.toBeDefined();
    });
  });
});
