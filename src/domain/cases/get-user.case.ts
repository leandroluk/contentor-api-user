import { IdentifiedHeader, RequestValidator } from '../generics';
import { User } from '../models';

export interface IGetUserCase {
  get(data: IGetUserCase.Data): Promise<IGetUserCase.Result>;
};
export namespace IGetUserCase {
  export type Data = {
    headers: IdentifiedHeader;
    params: Pick<User, '_uid'>;
  };
  export type Result = User;
  export type Validator = RequestValidator<Data>;
}
