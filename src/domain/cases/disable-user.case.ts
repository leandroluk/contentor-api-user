import { IdentifiedHeader, RequestValidator } from '../generics';
import { User } from '../models';

export interface IDisableUserCase {
  disable(data: IDisableUserCase.Data): Promise<IDisableUserCase.Result>;
};
export namespace IDisableUserCase {
  export type Data = {
    headers: IdentifiedHeader;
    params: Pick<User, '_uid'>;
  };
  export type Result = void;
  export type Validator = RequestValidator<Data>;
}
