import { ISnapshotUserRepo } from '$/data';
import { registry, singleton } from 'tsyringe';
import { INDEX_SNAPSHOT_USER } from '../constants';
import { elasticsearchHelper } from '../helper';

@singleton()
@registry([{ useClass: ElasticsearchSnapshotUserRepo, token: 'ISnapshotUserRepo' }])
export class ElasticsearchSnapshotUserRepo implements ISnapshotUserRepo {
  async snapshot(data: ISnapshotUserRepo.Data): Promise<ISnapshotUserRepo.Result> {
    await elasticsearchHelper.instance
      .index({
        index: INDEX_SNAPSHOT_USER,
        document: data
      });
  }
}
