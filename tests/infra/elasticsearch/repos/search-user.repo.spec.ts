import { ISearchUserRepo } from '$/data/repos';
import env from '$/env';
import { elasticsearchHelper } from '$/infra/elasticsearch';
import { ElasticsearchSearchUserRepo } from '$/infra/elasticsearch/repos';
import elasticsearch from '@elastic/elasticsearch';
import { makeElasticsearchSearch, throwFn } from 'tests/helpers';

function makeSut(): {
  sut: ElasticsearchSearchUserRepo;
  query: ISearchUserRepo.Query;
} {
  const sut = new ElasticsearchSearchUserRepo();
  const query: ISearchUserRepo.Query = {
    offset: 0,
    limit: env.db.limit
  };
  return {
    sut,
    query
  };
}

describe('infra/elasticsearch/repos/search-user.repo', () => {
  beforeAll(elasticsearchHelper.connect);

  describe('ElasticsearchSearchUserRepo.search', () => {
    it('should throw if parseSearch throws', async () => {
      const { sut, query } = makeSut();
      jest.spyOn(elasticsearchHelper, 'parseSearch')
        .mockImplementationOnce(throwFn);
      await expect(sut.search(query)).rejects.toThrow();
    });

    it('should throw if elasticsearch search throws', async () => {
      const { sut, query } = makeSut();
      ((elasticsearch as any).mock.search as jest.Mock)
        .mockRejectedValueOnce(new Error());
      await expect(sut.search(query)).rejects.toThrow();
    });

    it('should return search result', async () => {
      const { sut, query } = makeSut();
      ((elasticsearch as any).mock.search as jest.Mock)
        .mockResolvedValueOnce(makeElasticsearchSearch([{}]));
      const result = await sut.search(query);
      expect(result.items[0]).toEqual({});
      expect(result.total).toEqual(1);
      expect(result.offset).toEqual(0);
      expect(result.limit).toEqual(env.db.limit);
    });
  });
});
