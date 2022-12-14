import { PublishUserTask } from '$/data';
import { IPublishUserTask } from '$/presentation';
import { MockPublishUserRepo, MOCK_USER } from 'mocks';

function makeSut(): {
  publishUserRepo: MockPublishUserRepo;
  sut: PublishUserTask;
  data: IPublishUserTask.Data;
} {
  const publishUserRepo = new MockPublishUserRepo();
  const sut = new PublishUserTask(publishUserRepo);
  const data: IPublishUserTask.Data = MOCK_USER;
  return {
    publishUserRepo,
    sut,
    data
  };
}

describe('data/tasks/publish-user.task', () => {
  describe('PublishUserTask.publish', () => {
    it('should throw if publishUserRepo throws', async () => {
      const { publishUserRepo, sut, data } = makeSut();
      jest.spyOn(publishUserRepo, 'publish').mockRejectedValue(new Error());
      await expect(sut.publish(data)).rejects.toThrow();
    });

    it('should return list of snapshot of users', async () => {
      const { sut, data } = makeSut();
      await expect(sut.publish(data)).resolves.toBeUndefined();
    });
  });
});
