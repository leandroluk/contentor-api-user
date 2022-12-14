import { IDisableUserCase } from '$/domain';
import { DisableUserCase } from '$/presentation';
import crypto from 'crypto';
import {
  MockDisableUserTask,
  MockPublishUserTask,
  MockSnapshotUserTask
} from 'mocks';

function makeSut(): {
  disableUserTask: MockDisableUserTask;
  publishUserTask: MockPublishUserTask;
  snapshotUserTask: MockSnapshotUserTask;
  sut: DisableUserCase;
  data: IDisableUserCase.Data;
} {
  const disableUserTask = new MockDisableUserTask();
  const publishUserTask = new MockPublishUserTask();
  const snapshotUserTask = new MockSnapshotUserTask();
  const sut = new DisableUserCase(
    disableUserTask,
    publishUserTask,
    snapshotUserTask
  );
  const data: IDisableUserCase.Data = {
    headers: { from: crypto.randomUUID() },
    params: { _uid: crypto.randomUUID() }
  };
  return {
    disableUserTask,
    publishUserTask,
    snapshotUserTask,
    sut,
    data
  };
}

describe('presentation/cases/disable-user.case', () => {
  describe('DisableUserCase.disable', () => {
    it('should throw if disableUserTask throws', async () => {
      const { disableUserTask, sut, data } = makeSut();
      jest.spyOn(disableUserTask, 'disable').mockRejectedValue(new Error());
      await expect(sut.disable(data)).rejects.toThrow();
    });

    it('should throw if publishUserTask throws', async () => {
      const { publishUserTask, sut, data } = makeSut();
      jest.spyOn(publishUserTask, 'publish').mockRejectedValue(new Error());
      await expect(sut.disable(data)).rejects.toThrow();
    });

    it('should throw if snapshotUserTask throws', async () => {
      const { snapshotUserTask, sut, data } = makeSut();
      jest.spyOn(snapshotUserTask, 'snapshot').mockRejectedValue(new Error());
      await expect(sut.disable(data)).rejects.toThrow();
    });

    it('should return if disable user', async () => {
      const { sut, data } = makeSut();
      await expect(sut.disable(data)).resolves.toBeUndefined();
    });
  });
});
