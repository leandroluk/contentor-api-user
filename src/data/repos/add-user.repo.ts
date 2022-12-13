import { User } from '$/domain';

export interface IAddUserRepo {
  add(data: IAddUserRepo.Data): Promise<IAddUserRepo.Result>;
};
export namespace IAddUserRepo {
  export type Data = User;
  export type Result = void;
}
