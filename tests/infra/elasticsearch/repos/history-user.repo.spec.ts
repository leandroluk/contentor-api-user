import { IHistoryUserRepo } from '$/data/repos';
import { elasticsearchHelper } from '$/infra/elasticsearch';
import { ElasticsearchHistoryUserRepo } from '$/infra/elasticsearch/repos';
import elasticsearch from '@elastic/elasticsearch';
import { makeElasticsearchSearch } from 'tests/helpers';

function makeSut(): {
  sut: ElasticsearchHistoryUserRepo;
  uid: IHistoryUserRepo.Uid;
} {
  const sut = new ElasticsearchHistoryUserRepo();
  const uid: IHistoryUserRepo.Uid = 'uid';
  return {
    sut,
    uid
  };
}

describe('infra/elasticsearch/repos/history-user.repo', () => {
  beforeAll(elasticsearchHelper.connect);

  describe('ElasticsearchHistoryUserRepo.history', () => {
    it('should throw if elasticsearch search throws', async () => {
      const { sut, uid } = makeSut();
      ((elasticsearch as any).mock.search as jest.Mock)
        .mockRejectedValueOnce(new Error());
      await expect(sut.history(uid)).rejects.toThrow();
    });

    it('should return search result', async () => {
      const { sut, uid } = makeSut();
      ((elasticsearch as any).mock.search as jest.Mock)
        .mockResolvedValueOnce(makeElasticsearchSearch([{}]));
      const result = await sut.history(uid);
      expect(result).toBeDefined();
    });
  });
});
