import 'reflect-metadata';

global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
} as any;

jest.mock('@elastic/elasticsearch', () => {
  function Client(): void { }
  const mock = {
    search: jest.fn(async () => { }),
    ping: jest.fn(async () => { }),
    index: jest.fn(async () => { }),
    indexes: { create: jest.fn(async () => { }) }
  };
  Client.prototype = mock;
  return {
    mock,
    Client
  };
});
