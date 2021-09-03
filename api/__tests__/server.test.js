const request = require('supertest');
const server = require('../server');
const db = require('../data/dbConfig');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

it('sanity check', () => {
  expect(true).not.toBe(false);
});

describe('server.js', () => {
  it('is the correct testing environment', async () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('responds with api up on / request', async () => {
    const res = await request(server).get('/');
    expect(res.body).toMatchObject({ api: 'up' });
    expect(res.status).toBe(200);
  });
});
