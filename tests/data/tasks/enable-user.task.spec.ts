import { EnableUserTask } from '$/data';
import { IEnableUserTask } from '$/presentation';
import { MockEditUserRepo, MockGetUserRepo } from 'mocks';

function makeSut(): {
  getUserRepo: MockGetUserRepo;
  editUserRepo: MockEditUserRepo;
  sut: EnableUserTask;
  uid: IEnableUserTask.Uid;
} {
  const getUserRepo = new MockGetUserRepo();
  getUserRepo.$get._disabled = new Date();
  const editUserRepo = new MockEditUserRepo();
  const sut = new EnableUserTask(
    getUserRepo,
    editUserRepo
  );
  const uid: IEnableUserTask.Uid = 'uid';
  return {
    getUserRepo,
    editUserRepo,
    sut,
    uid
  };
}

describe('data/tasks/enable-user.task', () => {
  describe('EnableUserTask.enable', () => {
    it('should throw if getUserRepo throws', async () => {
      const { getUserRepo, sut, uid } = makeSut();
      jest.spyOn(getUserRepo, 'get').mockRejectedValue(new Error());
      await expect(sut.enable(uid)).rejects.toThrow();
    });

    it('should throw if getUserRepo return falsy', async () => {
      const { getUserRepo, sut, uid } = makeSut();
      jest.spyOn(getUserRepo, 'get').mockResolvedValue(null);
      await expect(sut.enable(uid)).rejects.toThrow();
    });

    it('should throw if getUserRepo return enabled user', async () => {
      const { getUserRepo, sut, uid } = makeSut();
      jest.spyOn(getUserRepo, 'get').mockResolvedValue({ _disabled: null } as any);
      await expect(sut.enable(uid)).rejects.toThrow();
    });

    it('should throw if editUserRepo throws', async () => {
      const { editUserRepo, sut, uid } = makeSut();
      jest.spyOn(editUserRepo, 'edit').mockRejectedValue(new Error());
      await expect(sut.enable(uid)).rejects.toThrow();
    });

    it('should return enabled user with updated fields', async () => {
      const { sut, uid } = makeSut();
      const result = await sut.enable(uid);
      expect(result._updated).toBeDefined();
      expect(result._disabled).toBeFalsy();
    });
  });
});
