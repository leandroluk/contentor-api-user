import { ISearchUserCase } from '$/domain';
import { SearchUserCase } from '$/presentation';
import crypto from 'crypto';
import { MockSearchUserTask } from 'mocks';

function makeSut(): {
  searchUserTask: MockSearchUserTask;
  sut: SearchUserCase;
  data: ISearchUserCase.Data;
} {
  const searchUserTask = new MockSearchUserTask();
  const sut = new SearchUserCase(
    searchUserTask
  );
  const data: ISearchUserCase.Data = {
    headers: { from: crypto.randomUUID() },
    body: {}
  };
  return {
    searchUserTask,
    sut,
    data
  };
}

describe('presentation/cases/search-user.case', () => {
  describe('SearchUserCase.search', () => {
    it('should throw if searchUserTask throws', async () => {
      const { searchUserTask, sut, data } = makeSut();
      jest.spyOn(searchUserTask, 'search').mockRejectedValue(new Error());
      await expect(sut.search(data)).rejects.toThrow();
    });

    it('should return search result', async () => {
      const { sut, data } = makeSut();
      await expect(sut.search(data)).resolves.toBeDefined();
    });
  });
});
