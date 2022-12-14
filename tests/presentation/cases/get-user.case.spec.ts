import { IGetUserCase } from '$/domain';
import { GetUserCase } from '$/presentation';
import crypto from 'crypto';
import { MockGetUserTask, MOCK_USER } from 'mocks';

function makeSut(): {
  getUserTask: MockGetUserTask;
  sut: GetUserCase;
  data: IGetUserCase.Data;
} {
  const getUserTask = new MockGetUserTask();
  const sut = new GetUserCase(
    getUserTask
  );
  const data: IGetUserCase.Data = {
    headers: { from: crypto.randomUUID() },
    params: { _uid: crypto.randomUUID() }
  };
  return {
    getUserTask,
    sut,
    data
  };
};

describe('presentation/cases/get-user.case', () => {
  describe('GetUserCase.get', () => {
    it('should throw if getUserTask throws', async () => {
      const { getUserTask, sut, data } = makeSut();
      jest.spyOn(getUserTask, 'get').mockRejectedValue(new Error());
      await expect(sut.get(data)).rejects.toThrow();
    });

    it('should return user', async () => {
      const { sut, data } = makeSut();
      const result: any = await sut.get(data);
      expect(result).toMatchObject(MOCK_USER);
    });
  });
});
