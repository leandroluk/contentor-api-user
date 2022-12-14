import { IEditUserCase } from '$/domain';
import { EditUserCase } from '$/presentation';
import crypto from 'crypto';
import {
  MockCheckEmailInUseTask,
  MockEditUserTask,
  MockPublishUserTask,
  MockSnapshotUserTask,
  MOCK_USER
} from 'mocks';

function makeSut(): {
  checkEmailInUseTask: MockCheckEmailInUseTask;
  editUserTask: MockEditUserTask;
  publishUserTask: MockPublishUserTask;
  snapshotUserTask: MockSnapshotUserTask;
  sut: EditUserCase;
  data: IEditUserCase.Data;
} {
  const checkEmailInUseTask = new MockCheckEmailInUseTask();
  const editUserTask = new MockEditUserTask();
  const publishUserTask = new MockPublishUserTask();
  const snapshotUserTask = new MockSnapshotUserTask();
  const sut = new EditUserCase(
    checkEmailInUseTask,
    editUserTask,
    publishUserTask,
    snapshotUserTask
  );
  const data: IEditUserCase.Data = {
    headers: { from: crypto.randomUUID() },
    params: { _uid: crypto.randomUUID() },
    body: {
      displayName: 'displayName',
      email: 'a@a.com',
      password: 'Test@123'
    }
  };
  return {
    checkEmailInUseTask,
    editUserTask,
    publishUserTask,
    snapshotUserTask,
    sut,
    data
  };
}

describe('presentation/cases/edit-user.case', () => {
  describe('EditUserCase.edit', () => {
    it('should throw if checkEmailInUseTask throws', async () => {
      const { checkEmailInUseTask, sut, data } = makeSut();
      jest.spyOn(checkEmailInUseTask, 'check').mockRejectedValue(new Error());
      await expect(sut.edit(data)).rejects.toThrow();
    });

    it('should throw if editUserTask throws', async () => {
      const { editUserTask, sut, data } = makeSut();
      jest.spyOn(editUserTask, 'edit').mockRejectedValue(new Error());
      await expect(sut.edit(data)).rejects.toThrow();
    });

    it('should throw if publishUserTask throws', async () => {
      const { publishUserTask, sut, data } = makeSut();
      jest.spyOn(publishUserTask, 'publish').mockRejectedValue(new Error());
      await expect(sut.edit(data)).rejects.toThrow();
    });

    it('should throw if snapshotUserTask throws', async () => {
      const { snapshotUserTask, sut, data } = makeSut();
      jest.spyOn(snapshotUserTask, 'snapshot').mockRejectedValue(new Error());
      await expect(sut.edit(data)).rejects.toThrow();
    });

    it('should return edited', async () => {
      const { sut, data } = makeSut();
      const result: any = await sut.edit(data);
      expect(result).toMatchObject(MOCK_USER);
    });
  });
});
