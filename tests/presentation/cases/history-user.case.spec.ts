import { IHistoryUserCase } from '$/domain';
import { HistoryUserCase } from '$/presentation';
import crypto from 'crypto';
import { MockHistoryUserTask } from 'mocks';

function makeSut(): {
  historyUserTask: MockHistoryUserTask;
  sut: HistoryUserCase;
  data: IHistoryUserCase.Data;
} {
  const historyUserTask = new MockHistoryUserTask();
  const sut = new HistoryUserCase(historyUserTask);
  const data: IHistoryUserCase.Data = {
    headers: { from: crypto.randomUUID() },
    params: { _uid: crypto.randomUUID() }
  };
  return {
    historyUserTask,
    sut,
    data
  };
}

describe('presentation/cases/history-user.case', () => {
  describe('HistoryUserCase.history', () => {
    it('should throw if historyUserTask throws', async () => {
      const { historyUserTask, sut, data } = makeSut();
      jest.spyOn(historyUserTask, 'history').mockRejectedValue(new Error());
      await expect(sut.history(data)).rejects.toThrow();
    });

    it('should return list of snapshots of user', async () => {
      const { sut, data } = makeSut();
      await expect(sut.history(data)).resolves.toBeDefined();
    });
  });
});
