import { IAddUserCase } from '$/domain';
import { AddUserCase } from '$/presentation';
import {
  MockAddUserTask,
  MockCheckEmailInUseTask,
  MockPublishUserTask,
  MockSnapshotUserTask,
  MOCK_USER
} from 'mocks';

function makeSut(): {
  checkEmailInUseTask: MockCheckEmailInUseTask;
  addUserTask: MockAddUserTask;
  publishUserTask: MockPublishUserTask;
  snapshotUserTask: MockSnapshotUserTask;
  sut: AddUserCase;
  data: IAddUserCase.Data;
} {
  const checkEmailInUseTask = new MockCheckEmailInUseTask();
  const addUserTask = new MockAddUserTask();
  const publishUserTask = new MockPublishUserTask();
  const snapshotUserTask = new MockSnapshotUserTask();
  const sut = new AddUserCase(
    checkEmailInUseTask,
    addUserTask,
    publishUserTask,
    snapshotUserTask
  );
  const data: IAddUserCase.Data = {
    headers: { from: crypto.randomUUID() },
    body: {
      displayName: 'displayName',
      email: 'a@a.com',
      password: 'Test@123'
    }
  };
  return {
    checkEmailInUseTask,
    addUserTask,
    publishUserTask,
    snapshotUserTask,
    sut,
    data
  };
}

describe('presentation/cases/add-user.case', () => {
  describe('AddUserCase.add', () => {
    it('should throw if checkEmailInUseTask throws', async () => {
      const { checkEmailInUseTask, sut, data } = makeSut();
      jest.spyOn(checkEmailInUseTask, 'check').mockRejectedValue(new Error());
      await expect(sut.add(data)).rejects.toThrow();
    });

    it('should throw if addUserTask throws', async () => {
      const { addUserTask, sut, data } = makeSut();
      jest.spyOn(addUserTask, 'add').mockRejectedValue(new Error());
      await expect(sut.add(data)).rejects.toThrow();
    });

    it('should throw if publishUserTask throws', async () => {
      const { publishUserTask, sut, data } = makeSut();
      jest.spyOn(publishUserTask, 'publish').mockRejectedValue(new Error());
      await expect(sut.add(data)).rejects.toThrow();
    });

    it('should throw if snapshotUserTask throws', async () => {
      const { snapshotUserTask, sut, data } = makeSut();
      jest.spyOn(snapshotUserTask, 'snapshot').mockRejectedValue(new Error());
      await expect(sut.add(data)).rejects.toThrow();
    });

    it('should return user', async () => {
      const { sut, data } = makeSut();
      const result: any = await sut.add(data);
      expect(result).toMatchObject(MOCK_USER);
    });
  });
});
