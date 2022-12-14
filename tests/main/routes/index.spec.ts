import { elasticsearchHelper, typeormDataSource } from '$/infra';
import app from '$/main';
import supertest from 'supertest';

describe('main/routes/api/index', () => {
  beforeAll(elasticsearchHelper.connect);

  describe('GET /health', () => {
    const url = '/health';

    it('should return 200 if healty', async () => {
      jest.spyOn(typeormDataSource, 'query').mockResolvedValueOnce(undefined);
      jest.spyOn(elasticsearchHelper.instance, 'ping').mockResolvedValueOnce(undefined);
      await supertest(app)
        .get(url)
        .expect(200);
    });

    it('should return 500 if typeorm unhealty', async () => {
      jest.spyOn(typeormDataSource, 'query').mockRejectedValueOnce(new Error());
      (elasticsearchHelper.instance.ping as jest.Mock).mockResolvedValueOnce(undefined);
      await supertest(app)
        .get(url)
        .expect(500);
    });

    it('should return 500 if elasticsearch unhealty', async () => {
      jest.spyOn(typeormDataSource, 'query').mockResolvedValueOnce(undefined);
      (elasticsearchHelper.instance.ping as jest.Mock).mockRejectedValueOnce(new Error());
      await supertest(app)
        .get(url)
        .expect(500);
    });
  });

  describe('OPTIONS *', () => {
    it('should return 200 for any OPTIONS route', async () => {
      await supertest(app)
        .options('/any/request')
        .expect(200);
    });
  });
});
