import { Search, Unique } from '$/domain';
import { typeormDataSource } from '$/infra';
import { operatorsMapToTypeORM, searchQueryToTypeORM } from '$/infra/typeorm/helper';
import { makeCreateQueryBuilder } from 'tests/helpers';

describe('infra/typeorm/helper', () => {
  describe('operatorsMapToTypeORM', () => {
    it.each([
      ['eq', ['(x.field = :field)', { field: 'value' }]],
      ['gt', ['(x.field > :field)', { field: 'value' }]],
      ['gte', ['(x.field >= :field)', { field: 'value' }]],
      ['lt', ['(x.field < :field)', { field: 'value' }]],
      ['lte', ['(x.field <= :field)', { field: 'value' }]],
      ['in', ['(x.field IN :field)', { field: 'value' }]],
      ['like', ['(x.field ILIKE :field)', { field: '%value%' }]],
      ['neq', ['(NOT (x.field = :field))', { field: 'value' }]],
      ['ngt', ['(NOT (x.field > :field))', { field: 'value' }]],
      ['ngte', ['(NOT (x.field >= :field))', { field: 'value' }]],
      ['nlt', ['(NOT (x.field < :field))', { field: 'value' }]],
      ['nlte', ['(NOT (x.field <= :field))', { field: 'value' }]],
      ['nin', ['(NOT (x.field IN :field))', { field: 'value' }]],
      ['nlike', ['(NOT (x.field ILIKE :field))', { field: '%value%' }]]
    ])('should parse %p operator', (op, expected) => {
      expect(operatorsMapToTypeORM[op]('field', 'value')).toEqual(expected);
    });
  });

  describe('searchQueryToTypeORM', () => {
    type Test = Unique & {
      field: string;
    };

    class TestEntity implements Test {
      _uid: string;
      field: string;
    }

    const availableFields: Array<string & keyof Test> = ['_uid', 'field'];
    const fullTextFields: Partial<Array<string & keyof Test>> = ['field'];

    it('should use query.fields.select', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockImplementationOnce(() => builder as any);
      const query: Search.Query<Test> = { fields: { select: ['_uid'] } };
      const expected = ['x._uid'];
      await searchQueryToTypeORM(TestEntity, query, availableFields, fullTextFields);
      expect(builder.select).toHaveBeenCalledWith(expected);
    });

    it('should use query.fields.remove', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockImplementationOnce(() => builder as any);
      const query: Search.Query<Test> = { fields: { remove: ['_uid'] } };
      const expected = ['x.field'];
      await searchQueryToTypeORM(TestEntity, query, availableFields, fullTextFields);
      expect(builder.select).toHaveBeenCalledWith(expected);
    });

    it('should use query.text', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockImplementationOnce(() => builder as any);
      const query: Search.Query<Test> = { text: 'text' };
      const matchers = [
        'x.field ILIKE :perc',
        'SOUNDEX(x.field), SOUNDEX(:raw) > 4',
        'LEVENSHTEIN(LOWER(x.field), LOWER(:raw)) < 4'
      ];
      await searchQueryToTypeORM(TestEntity, query, availableFields, fullTextFields);
      expect(builder.andWhere).toHaveBeenCalledWith(
        `(${matchers.join(' OR ')})`,
        { raw: query.text, perc: `%${query.text}%` }
      );
    });

    it('should use query.where', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockImplementationOnce(() => builder as any);
      const query: Search.Query<Test> = { where: { field: { eq: 'value' } } };
      await searchQueryToTypeORM(TestEntity, query, availableFields, fullTextFields);
      expect(builder.andWhere).toHaveBeenCalledWith('(x.field = :field)', { field: 'value' });
    });

    it('should use query.sort', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockImplementationOnce(() => builder as any);
      const query: Search.Query<Test> = { sort: { _uid: -1, field: 1 } };
      await searchQueryToTypeORM(TestEntity, query, availableFields, fullTextFields);
      expect(builder.addOrderBy).toHaveBeenCalledWith('_uid', 'DESC');
      expect(builder.addOrderBy).toHaveBeenCalledWith('field', 'ASC');
    });

    it('should use query.offset and query.limit', async () => {
      const builder = makeCreateQueryBuilder();
      jest.spyOn(typeormDataSource, 'createQueryBuilder').mockImplementationOnce(() => builder as any);
      const query: Search.Query<Test> = { offset: 2, limit: 2 };
      await searchQueryToTypeORM(TestEntity, query, availableFields, fullTextFields);
      expect(builder.skip).toHaveBeenCalledWith(2);
      expect(builder.take).toHaveBeenCalledWith(2);
    });
  });
});
