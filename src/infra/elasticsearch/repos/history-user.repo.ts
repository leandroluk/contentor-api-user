import { IHistoryUserRepo } from '$/data';
import { registry, singleton } from 'tsyringe';
import { INDEX_SNAPSHOT_USER } from '../constants';
import { elasticsearchHelper } from '../helper';

@singleton()
@registry([{ useClass: ElasticsearchHistoryUserRepo, token: 'IHistoryUserRepo' }])
export class ElasticsearchHistoryUserRepo implements IHistoryUserRepo {
  async history(uid: IHistoryUserRepo.Uid): Promise<IHistoryUserRepo.Result> {
    const result = await elasticsearchHelper.instance
      .search<IHistoryUserRepo.Type>({
        index: INDEX_SNAPSHOT_USER,
        query: { match: { _uid: uid } }
      });
    return result.hits.hits.map(item => item._source);
  }
}
