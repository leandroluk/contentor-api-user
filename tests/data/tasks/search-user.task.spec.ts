import { SearchUserTask } from '$/data';
import { ISearchUserTask } from '$/presentation';
import { MockSearchUserRepo } from 'mocks';

function makeSut(): {
  searchUserRepo: MockSearchUserRepo;
  sut: SearchUserTask;
  query: ISearchUserTask.Query;
} {
  const searchUserRepo = new MockSearchUserRepo();
  const sut = new SearchUserTask(
    searchUserRepo
  );
  const query: ISearchUserTask.Query = {};
  return {
    searchUserRepo,
    sut,
    query
  };
}

describe('data/tasks/search-user.task', () => {
  describe('SearchUserTask.search', () => {
    it('should throw if searchUserRepo throws', async () => {
      const { searchUserRepo, sut, query } = makeSut();
      jest.spyOn(searchUserRepo, 'search').mockRejectedValue(new Error());
      await expect(sut.search(query)).rejects.toThrow();
    });

    it('should return search result', async () => {
      const { sut, query } = makeSut();
      await expect(sut.search(query)).resolves.toBeDefined();
    });
  });
});
