import { ISnapshotUserRepo } from '$/data/repos';
import { elasticsearchHelper } from '$/infra/elasticsearch';
import { ElasticsearchSnapshotUserRepo } from '$/infra/elasticsearch/repos';
import elasticsearch from '@elastic/elasticsearch';
import { MOCK_USER } from 'mocks';

function makeSut(): {
  sut: ElasticsearchSnapshotUserRepo;
  data: ISnapshotUserRepo.Data;
} {
  const sut = new ElasticsearchSnapshotUserRepo();
  const data: ISnapshotUserRepo.Data = {
    ...MOCK_USER,
    _sid: '_sid',
    _ctor: '_ctor',
    _ttl: new Date()
  };
  return {
    sut,
    data
  };
}

describe('infra/elasticsearch/repos/snapshot-user.repo', () => {
  beforeAll(elasticsearchHelper.connect);

  describe('ElasticsearchSnapshotUserRepo.snapshot', () => {
    it('should throw if elasticsearch search throws', async () => {
      const { sut, data } = makeSut();
      ((elasticsearch as any).mock.index as jest.Mock)
        .mockRejectedValueOnce(new Error());
      await expect(sut.snapshot(data)).rejects.toThrow();
    });

    it('should return if success', async () => {
      const { sut, data } = makeSut();
      ((elasticsearch as any).mock.index as jest.Mock)
        .mockResolvedValueOnce(undefined);
      await expect(sut.snapshot(data)).resolves.toBeUndefined();
    });
  });
});
