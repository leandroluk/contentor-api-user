import { AddUserTask } from '$/data';
import { IAddUserTask } from '$/presentation';
import { MockAddUserRepo, MockCreateUidContract, MockHashPasswordContract } from 'mocks';

function makeSut(): {
  createUidContract: MockCreateUidContract;
  hashPasswordContract: MockHashPasswordContract;
  addUserRepo: MockAddUserRepo;
  sut: AddUserTask;
  data: IAddUserTask.Data;
} {
  const createUidContract = new MockCreateUidContract();
  const hashPasswordContract = new MockHashPasswordContract();
  const addUserRepo = new MockAddUserRepo();
  const sut = new AddUserTask(
    createUidContract,
    hashPasswordContract,
    addUserRepo
  );
  const data: IAddUserTask.Data = {
    displayName: 'displayName',
    email: 'email',
    password: 'password'
  };
  return {
    createUidContract,
    hashPasswordContract,
    addUserRepo,
    sut,
    data
  };
}

describe('data/tasks/add-user.task', () => {
  describe('AddUserTask.add', () => {
    it('should throw if create uuid contract throws', async () => {
      const { createUidContract, sut, data } = makeSut();
      jest.spyOn(createUidContract, 'create').mockRejectedValue(new Error());
      await expect(sut.add(data)).rejects.toThrow();
    });

    it('should throw if hash password contract throws', async () => {
      const { hashPasswordContract, sut, data } = makeSut();
      jest.spyOn(hashPasswordContract, 'hash').mockRejectedValue(new Error());
      await expect(sut.add(data)).rejects.toThrow();
    });

    it('should throw if add user repo throws', async () => {
      const { addUserRepo, sut, data } = makeSut();
      jest.spyOn(addUserRepo, 'add').mockRejectedValue(new Error());
      await expect(sut.add(data)).rejects.toThrow();
    });

    it('should return result', async () => {
      const { sut, data } = makeSut();
      const result = await sut.add(data);
      expect(result._uid).toBeDefined();
      expect(result._created).toBeDefined();
      expect(result._updated).toBeNull();
      expect(result._disabled).toBeNull();
      expect(result.email).toBe(data.email);
      expect(result.password).not.toBe(data.password);
    });
  });
});
