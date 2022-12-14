import { IAddUserCase, IEditUserCase } from '$/domain';
import env from '$/env';
import { elasticsearchHelper, typeormDataSource } from '$/infra';
import app from '$/main';
import elasticsearch from '@elastic/elasticsearch';
import { MOCK_USER } from 'mocks';
import supertest from 'supertest';
import { importModules, makeCreateQueryBuilder, makeElasticsearchSearch } from 'tests/helpers';

describe('main/routes/api/user.routes', () => {
  beforeAll(async () => await Promise.all([
    importModules(),
    elasticsearchHelper.connect()
  ]));
  const from = crypto.randomUUID();

  describe('POST /api/user/_search', () => {
    const url = '/api/user/_search';

    it('should return 400 if request is not identified', async () => {
      await supertest(app)
        .post(url)
        .expect(400);
    });

    it('should return 200 with search result', async () => {
      ((elasticsearch as any).mock.search as jest.Mock)
        .mockResolvedValueOnce(makeElasticsearchSearch([MOCK_USER]));

      const result = await supertest(app)
        .post(url)
        .set({ from });

      expect(result.status).toBe(200);
      expect(result.body.items[0]._uid).toBe(MOCK_USER._uid);
      expect(result.body.items[0]._created).toBe(MOCK_USER._created.toJSON());
      expect(result.body.items[0]._updated).toBe(MOCK_USER._updated);
      expect(result.body.items[0]._disabled).toBe(MOCK_USER._disabled);
      expect(result.body.items[0].displayName).toBe(MOCK_USER.displayName);
      expect(result.body.items[0].email).toBe(MOCK_USER.email);
      expect(result.body.items[0].password).toBe(MOCK_USER.password);
      expect(result.body.total).toBe(1);
      expect(result.body.offset).toBe(0);
      expect(result.body.limit).toBe(env.db.limit);
    });
  });

  describe('GET /api/user/:_uid/_history', () => {
    const url = `/api/user/${crypto.randomUUID()}/_history`;

    it('should return 400 if request is not identified', async () => {
      await supertest(app)
        .get(url)
        .expect(400);
    });

    it('should return 400 if invalid params', async () => {
      await supertest(app)
        .get('/api/user/uuid/_history')
        .set({ from })
        .expect(400);
    });

    it('should return 200 with history result', async () => {
      ((elasticsearch as any).mock.search as jest.Mock)
        .mockResolvedValueOnce(makeElasticsearchSearch([]));

      const result = await supertest(app)
        .get(url)
        .set({ from });

      expect(result.status).toBe(200);
      expect(result.body).toEqual([]);
    });
  });

  describe('DELETE /api/user/:_uid/_rollback', () => {
    const url = `/api/user/${crypto.randomUUID()}/_rollback`;

    it('should return 400 if request is not identified', async () => {
      await supertest(app)
        .delete(url)
        .expect(400);
    });

    it('should return 400 if invalid params', async () => {
      await supertest(app)
        .delete('/api/user/uuid/_rollback')
        .set({ from })
        .expect(400);
    });

    it('should return 404 if user not found', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      builder.getOne
        // enable user
        .mockResolvedValueOnce(undefined);

      await supertest(app)
        .delete(url)
        .set({ from })
        .expect(404);
    });

    it('should return 409 if user already enabled', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      builder.getOne
        // enable user
        .mockResolvedValueOnce({ _disabled: null });

      await supertest(app)
        .delete(url)
        .set({ from })
        .expect(409);
    });

    it('should return 200 if enable user', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      builder.getOne
        // enable user
        .mockResolvedValueOnce({ _disabled: new Date() });

      await supertest(app)
        .delete(url)
        .set({ from })
        .expect(200);
    });
  });

  describe('DELETE /api/user/:_uid', () => {
    const url = `/api/user/${crypto.randomUUID()}`;

    it('should return 400 if request is not identified', async () => {
      await supertest(app)
        .delete(url)
        .expect(400);
    });

    it('should return 400 if invalid params', async () => {
      await supertest(app)
        .delete('/api/user/uuid')
        .set({ from })
        .expect(400);
    });

    it('should return 404 if user not found', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      builder.getOne
        // enable user
        .mockResolvedValueOnce(undefined);

      await supertest(app)
        .delete(url)
        .set({ from })
        .expect(404);
    });

    it('should return 409 if user already disabled', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      builder.getOne
        // enable user
        .mockResolvedValueOnce({ _disabled: new Date() });

      await supertest(app)
        .delete(url)
        .set({ from })
        .expect(409);
    });

    it('should return 204 if disable user', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      builder.getOne
        // enable user
        .mockResolvedValueOnce({ _disabled: null });

      await supertest(app)
        .delete(url)
        .set({ from })
        .expect(204);
    });
  });

  describe('PUT /api/user/:_uid', () => {
    const url = `/api/user/${crypto.randomUUID()}`;
    const validBody: IEditUserCase.Data['body'] = {
      displayName: 'displayName',
      email: 'user@email.com',
      password: 'Change@123'
    };

    it('should return 400 if request is not identified', async () => {
      await supertest(app)
        .put(url)
        .expect(400);
    });

    it('should return 400 if invalid params', async () => {
      await supertest(app)
        .put('/api/user/uuid')
        .set({ from })
        .expect(400);
    });

    it.each([
      ['body.displayName is null', { ...validBody, displayName: null }],
      ['body.displayName is empty', { ...validBody, displayName: '' }],
      ['body.displayName is not a string', { ...validBody, displayName: 1 }],
      ['body.displayName is greater than 100 chars', { ...validBody, displayName: ''.padStart(101, 'a') }],
      ['body.email is null', { ...validBody, email: 1 }],
      ['body.email is empty', { ...validBody, email: '' }],
      ['body.email is not a string', { ...validBody, email: 1 }],
      ['body.email is not a email', { ...validBody, email: 'invalid' }],
      ['body.email is greater than 100 chars', { ...validBody, email: 'user@email.com'.padStart(101, 'a') }],
      ['body.password is null', { ...validBody, password: null }],
      ['body.password is empty', { ...validBody, password: '' }],
      ['body.password is not a string', { ...validBody, password: 1 }],
      ['body.password is lower than 8 chars', { ...validBody, password: '1' }],
      ['body.password is greater than 50 chars', { ...validBody, password: ''.padStart(51, '0') }],
      ['body.password does match with regex', { ...validBody, password: '123456789' }]
    ])('should return 400 if %p', async (_, body) => {
      await supertest(app)
        .put(url)
        .send(body)
        .set({ from })
        .expect(400);
    });

    it('should return 404 if user not found', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      builder.getOne
        .mockResolvedValueOnce(undefined) // checkEmailInUsetask
        .mockResolvedValueOnce(undefined); // editUserTask

      await supertest(app)
        .put(url)
        .send(validBody)
        .set({ from })
        .expect(404);
    });

    it('should return 409 if changes.email already in use', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      builder.getOne
        .mockResolvedValueOnce({ _uid: '_uid' }) // getUserByEmailTask
        .mockResolvedValueOnce({ _disabled: new Date() }); // editUserTask

      await supertest(app)
        .put(url)
        .send(validBody)
        .set({ from })
        .expect(409);
    });

    it('should return 422 if user is disabled', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      builder.getOne
        .mockResolvedValueOnce(undefined) // getUserByEmailTask
        .mockResolvedValueOnce({ _disabled: new Date() }); // editUserTask

      await supertest(app)
        .put(url)
        .send(validBody)
        .set({ from })
        .expect(422);
    });

    it('should return 200 if edit user', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      builder.getOne
        .mockResolvedValueOnce(undefined) // getUserByEmailTask
        .mockResolvedValueOnce({ _disabled: null }); // editUserTask

      await supertest(app)
        .put(url)
        .send(validBody)
        .set({ from })
        .expect(200);
    });
  });

  describe('GET /api/user/:_uid', () => {
    const url = `/api/user/${crypto.randomUUID()}`;

    it('should return 400 if request is not identified', async () => {
      await supertest(app)
        .get(url)
        .expect(400);
    });

    it('should return 400 if invalid params', async () => {
      await supertest(app)
        .get('/api/user/uuid')
        .set({ from })
        .expect(400);
    });

    it('should return 404 if user not found', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      builder.getOne
        .mockResolvedValueOnce(undefined); // getUserTask

      await supertest(app)
        .get(url)
        .set({ from })
        .expect(404);
    });

    it('should return 200 with user', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      builder.getOne
        .mockResolvedValueOnce({}); // getUserTask

      await supertest(app)
        .get(url)
        .set({ from })
        .expect(200);
    });
  });

  describe('POST /api/user', () => {
    const url = '/api/user';
    const validBody: IAddUserCase.Data['body'] = {
      displayName: 'displayName',
      email: 'user@email.com',
      password: 'Change@123'
    };

    it('should return 400 if request is not identified', async () => {
      await supertest(app)
        .post(url)
        .send(validBody)
        .expect(400);
    });

    it.each([
      ['body.displayName is null', { ...validBody, displayName: null }],
      ['body.displayName is empty', { ...validBody, displayName: '' }],
      ['body.displayName is not a string', { ...validBody, displayName: 1 }],
      ['body.displayName is greater than 100 chars', { ...validBody, displayName: ''.padStart(101, 'a') }],
      ['body.email is null', { ...validBody, email: 1 }],
      ['body.email is empty', { ...validBody, email: '' }],
      ['body.email is not a string', { ...validBody, email: 1 }],
      ['body.email is not a email', { ...validBody, email: 'invalid' }],
      ['body.email is greater than 100 chars', { ...validBody, email: 'user@email.com'.padStart(101, 'a') }],
      ['body.password is null', { ...validBody, password: null }],
      ['body.password is empty', { ...validBody, password: '' }],
      ['body.password is not a string', { ...validBody, password: 1 }],
      ['body.password is lower than 8 chars', { ...validBody, password: '1' }],
      ['body.password is greater than 50 chars', { ...validBody, password: ''.padStart(51, '0') }],
      ['body.password does match with regex', { ...validBody, password: '123456789' }]
    ])('should return 400 if %p', async (_, body) => {
      await supertest(app)
        .post(url)
        .send(body)
        .set({ from })
        .expect(400);
    });

    it('should return 409 if email already in use', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      builder.getOne
        .mockResolvedValueOnce({ _uid: '_uid' }); // getUserByEmailTask

      await supertest(app)
        .post(url)
        .send(validBody)
        .set({ from })
        .expect(409);
    });

    it('should return 201 if add user', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockReturnValue(builder as any);
      builder.getOne
        .mockResolvedValueOnce(undefined); // getUserByEmailTask;

      await supertest(app)
        .post(url)
        .send(validBody)
        .set({ from })
        .expect(201);
    });
  });
});
