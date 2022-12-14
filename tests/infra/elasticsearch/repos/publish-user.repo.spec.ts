import { IPublishUserRepo } from '$/data/repos';
import { elasticsearchHelper } from '$/infra/elasticsearch';
import { ElasticSearchPublishUserRepo } from '$/infra/elasticsearch/repos';
import elasticsearch from '@elastic/elasticsearch';
import { MOCK_USER } from 'mocks';

function makeSut(): {
  sut: ElasticSearchPublishUserRepo;
  data: IPublishUserRepo.Data;
} {
  const sut = new ElasticSearchPublishUserRepo();
  const data: IPublishUserRepo.Data = MOCK_USER;
  return {
    sut,
    data
  };
}

describe('infra/elasticsearch/repos/publish-user.repo', () => {
  beforeAll(elasticsearchHelper.connect);

  describe('ElasticSearchPublishUserRepo.publish', () => {
    it('should throw if elasticsearch search throws', async () => {
      const { sut, data } = makeSut();
      ((elasticsearch as any).mock.index as jest.Mock)
        .mockRejectedValueOnce(new Error());
      await expect(sut.publish(data)).rejects.toThrow();
    });

    it('should return if success', async () => {
      const { sut, data } = makeSut();
      ((elasticsearch as any).mock.index as jest.Mock)
        .mockResolvedValueOnce(undefined);
      await expect(sut.publish(data)).resolves.toBeUndefined();
    });
  });
});
