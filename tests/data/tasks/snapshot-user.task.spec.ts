import { SnapshotUserTask } from '$/data';
import { ISnapshotUserTask } from '$/presentation';
import { MockCreateUidContract, MockSnapshotUserRepo, MOCK_USER } from 'mocks';

function makeSut(): {
  createUidContract: MockCreateUidContract;
  snapshotUserRepo: MockSnapshotUserRepo;
  sut: SnapshotUserTask;
  data: ISnapshotUserTask.Data;
  ctor: ISnapshotUserTask.Ctor;
} {
  const createUidContract = new MockCreateUidContract();
  const snapshotUserRepo = new MockSnapshotUserRepo();
  const sut = new SnapshotUserTask(createUidContract, snapshotUserRepo);
  const data: ISnapshotUserTask.Data = MOCK_USER;
  const ctor: ISnapshotUserTask.Ctor = 'ctor';
  return {
    createUidContract,
    snapshotUserRepo,
    sut,
    data,
    ctor
  };
}

describe('data/tasks/snapshot-user.task', () => {
  describe('SnapshotUserTask.snapshot', () => {
    it('should throw if createUidContract throws', async () => {
      const { createUidContract, sut, data, ctor } = makeSut();
      jest.spyOn(createUidContract, 'create').mockRejectedValue(new Error());
      await expect(sut.snapshot(data, ctor)).rejects.toThrow();
    });

    it('should throw if snapshotUserRepo throws', async () => {
      const { snapshotUserRepo, sut, data, ctor } = makeSut();
      jest.spyOn(snapshotUserRepo, 'snapshot').mockRejectedValue(new Error());
      await expect(sut.snapshot(data, ctor)).rejects.toThrow();
    });

    it('should return list of snapshot of users', async () => {
      const { sut, data, ctor } = makeSut();
      await expect(sut.snapshot(data, ctor)).resolves.toBeUndefined();
    });
  });
});
