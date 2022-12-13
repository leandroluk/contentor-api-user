import { Unique, User } from '$/domain';

export interface IEditUserRepo {
  edit(uid: IEditUserRepo.Uid, changes: IEditUserRepo.Changes): Promise<IEditUserRepo.Result>;
};
export namespace IEditUserRepo {
  export type Uid = User['_uid'];
  export type Changes = Partial<Omit<User, keyof Unique>>;
  export type Result = void;
}
