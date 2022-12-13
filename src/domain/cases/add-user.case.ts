import { Entity, IdentifiedHeader, RequestValidator } from '../generics';
import { User } from '../models';

export interface IAddUserCase {
  add(data: IAddUserCase.Data): Promise<IAddUserCase.Result>;
};
export namespace IAddUserCase {
  export type Data = {
    headers: IdentifiedHeader;
    body: Omit<User, keyof Entity>;
  };
  export type Result = User;
  export type Validator = RequestValidator<Data>;
}
