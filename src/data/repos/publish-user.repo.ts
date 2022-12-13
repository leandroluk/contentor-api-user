import { User } from '$/domain';

export type IPublishUserRepo = {
  publish(data: IPublishUserRepo.Data): Promise<IPublishUserRepo.Result>;
};
export namespace IPublishUserRepo {
  export type Data = User;
  export type Result = void;
}
