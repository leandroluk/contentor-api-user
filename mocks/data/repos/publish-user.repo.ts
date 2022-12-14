import { IPublishUserRepo } from '$/data';

export class MockPublishUserRepo implements IPublishUserRepo {
  async publish(_data: IPublishUserRepo.Data): Promise<IPublishUserRepo.Result> {
  }
}
