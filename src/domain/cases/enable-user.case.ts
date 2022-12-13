import { IdentifiedHeader, RequestValidator } from '../generics';
import { User } from '../models';

export interface IEnableUserCase {
  enable(data: IEnableUserCase.Data): Promise<IEnableUserCase.Result>;
};
export namespace IEnableUserCase {
  export type Data = {
    headers: IdentifiedHeader;
    params: Pick<User, '_uid'>;
  };
  export type Result = User;
  export type Validator = RequestValidator<Data>;
}
