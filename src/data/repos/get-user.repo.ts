import { User } from '$/domain';

export interface IGetUserRepo {
  get(uid: IGetUserRepo.Uid): Promise<IGetUserRepo.Result>;
};
export namespace IGetUserRepo {
  export type Uid = User['_uid'];
  export type Result = User;
}
