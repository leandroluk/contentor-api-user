import { CheckEmailInUseTask } from '$/data';
import { ICheckEmailInUseTask } from '$/presentation';
import { MockGetUserByEmailRepo } from 'mocks';

function makeSut(): {
  getUserByEmailRepo: MockGetUserByEmailRepo;
  sut: CheckEmailInUseTask;
  email: ICheckEmailInUseTask.Email;
  uid: ICheckEmailInUseTask.Uid;
} {
  const getUserByEmailRepo = new MockGetUserByEmailRepo();
  const sut = new CheckEmailInUseTask(getUserByEmailRepo);
  const email: ICheckEmailInUseTask.Email = 'email';
  const uid: ICheckEmailInUseTask.Uid = 'uid';
  return {
    getUserByEmailRepo,
    sut,
    email,
    uid
  };
}

describe('data/tasks/check-email-in-use.task', () => {
  describe('CheckEmailInUseTask.check', () => {
    it('should throw if getUserByEmailRepo throws', async () => {
      const { getUserByEmailRepo, sut, email, uid } = makeSut();
      jest.spyOn(getUserByEmailRepo, 'getByEmail').mockRejectedValue(new Error());
      await expect(sut.check(email, uid)).rejects.toThrow();
    });

    it('should throw if getUserByEmailRepo return diferent uid', async () => {
      const { getUserByEmailRepo, sut, email, uid } = makeSut();
      getUserByEmailRepo.$getByEmail._uid = 'diferent';
      await expect(sut.check(email, uid)).rejects.toThrow();
    });

    it('should return user if success', async () => {
      const { getUserByEmailRepo, sut, email, uid } = makeSut();
      getUserByEmailRepo.$getByEmail = null;
      await expect(sut.check(email, uid)).resolves.toBeUndefined();
    });
  });
});
