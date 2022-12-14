import { IHashPasswordContract } from '$/data';
import { HashPasswordAdapter } from '$/infra';

jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => ({
    toString: jest.fn(() => 'key')
  })),
  createHmac: jest.fn(() => ({
    update: jest.fn(() => ({
      digest: jest.fn(() => 'hashed')
    }))
  }))
}));

function makeSut(): {
  sut: HashPasswordAdapter;
  password: IHashPasswordContract.Password;
} {
  const sut = new HashPasswordAdapter();
  const password: IHashPasswordContract.Password = 'password';
  return {
    sut,
    password
  };
}

describe('infra/adapters/hash-password.adapter', () => {
  describe('HashPasswordAdapter.hash', () => {
    it('should return key concated with hashed password', async () => {
      const { sut, password } = makeSut();
      await expect(sut.hash(password)).resolves.toBe('keyhashed');
    });
  });
});
