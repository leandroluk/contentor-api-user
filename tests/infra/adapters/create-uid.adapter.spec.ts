import { CreateUidAdapter } from '$/infra';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'uuid')
}));

function makeSut(): {
  sut: CreateUidAdapter;
} {
  const sut = new CreateUidAdapter();
  return {
    sut
  };
};

describe('infra/adapters/create-uid.adapter', () => {
  describe('CreateUidAdapter.create', () => {
    it('should create uuid', async () => {
      const { sut } = makeSut();
      await expect(sut.create()).resolves.toBe('uuid');
    });
  });
});
