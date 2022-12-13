import { Entity, IdentifiedHeader, RequestValidator } from '../generics';
import { User } from '../models';

export interface IEditUserCase {
  edit(data: IEditUserCase.Data): Promise<IEditUserCase.Result>;
};
export namespace IEditUserCase {
  export type Data = {
    headers: IdentifiedHeader;
    params: Pick<User, '_uid'>;
    body: Partial<Omit<User, keyof Entity>>;
  };
  export type Result = User;
  export type Validator = RequestValidator<Data>;
}
