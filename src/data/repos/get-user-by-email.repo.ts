import { User } from '$/domain';

export interface IGetUserByEmailRepo {
  getByEmail(email: IGetUserByEmailRepo.Email): Promise<IGetUserByEmailRepo.Result>;
};
export namespace IGetUserByEmailRepo {
  export type Email = User['email'];
  export type Result = User;
}
