import { HistoryUserTask } from '$/data';
import { IHistoryUserTask } from '$/presentation';
import { MockHistoryUserRepo } from 'mocks';

function makeSut(): {
  historyUserRepo: MockHistoryUserRepo;
  sut: HistoryUserTask;
  uid: IHistoryUserTask.Uid;
} {
  const historyUserRepo = new MockHistoryUserRepo();
  const sut = new HistoryUserTask(historyUserRepo);
  const uid: IHistoryUserTask.Uid = 'uid';
  return {
    historyUserRepo,
    sut,
    uid
  };
}

describe('data/tasks/history-user.task', () => {
  describe('HistoryUserTask.history', () => {
    it('should throw if historyUserRepo throws', async () => {
      const { historyUserRepo, sut, uid } = makeSut();
      jest.spyOn(historyUserRepo, 'history').mockRejectedValue(new Error());
      await expect(sut.history(uid)).rejects.toThrow();
    });

    it('should return list of snapshot of users', async () => {
      const { sut, uid } = makeSut();
      await expect(sut.history(uid)).resolves.toBeDefined();
    });
  });
});
