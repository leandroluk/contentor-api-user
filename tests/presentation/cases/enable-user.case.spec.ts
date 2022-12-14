import { IEnableUserCase } from '$/domain';
import { EnableUserCase } from '$/presentation';
import crypto from 'crypto';
import {
  MockEnableUserTask,
  MockPublishUserTask,
  MockSnapshotUserTask,
  MOCK_USER
} from 'mocks';

function makeSut(): {
  enableUserTask: MockEnableUserTask;
  publishUserTask: MockPublishUserTask;
  snapshotUserTask: MockSnapshotUserTask;
  sut: EnableUserCase;
  data: IEnableUserCase.Data;
} {
  const enableUserTask = new MockEnableUserTask();
  const publishUserTask = new MockPublishUserTask();
  const snapshotUserTask = new MockSnapshotUserTask();
  const sut = new EnableUserCase(
    enableUserTask,
    publishUserTask,
    snapshotUserTask
  );
  const data: IEnableUserCase.Data = {
    headers: { from: crypto.randomUUID() },
    params: { _uid: crypto.randomUUID() }
  };
  return {
    enableUserTask,
    publishUserTask,
    snapshotUserTask,
    sut,
    data
  };
};

describe('presentation/cases/enable-user.case', () => {
  describe('EnableUserCase.enable', () => {
    it('should throw if enableUserTask throws', async () => {
      const { enableUserTask, sut, data } = makeSut();
      jest.spyOn(enableUserTask, 'enable').mockRejectedValue(new Error());
      await expect(sut.enable(data)).rejects.toThrow();
    });

    it('should throw if publishUserTask throws', async () => {
      const { publishUserTask, sut, data } = makeSut();
      jest.spyOn(publishUserTask, 'publish').mockRejectedValue(new Error());
      await expect(sut.enable(data)).rejects.toThrow();
    });

    it('should throw if snapshotUserTask throws', async () => {
      const { snapshotUserTask, sut, data } = makeSut();
      jest.spyOn(snapshotUserTask, 'snapshot').mockRejectedValue(new Error());
      await expect(sut.enable(data)).rejects.toThrow();
    });

    it('should return user without password', async () => {
      const { sut, data } = makeSut();
      const result: any = await sut.enable(data);
      expect(result).toMatchObject(MOCK_USER);
    });
  });
});
