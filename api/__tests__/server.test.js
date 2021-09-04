const request = require('supertest');
const server = require('../server');
const {NODE_ENV} = require('../secrets');

const db = require('../data/dbConfig');


beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db('user').truncate();
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
    expect(process.env.NODE_ENV).toBe('testing');
  });

  it('responds with api up on / request', async () => {
    const res = await request(server).get('/');
    expect(res.body).toMatchObject({ api: 'up' });
    expect(res.status).toBe(200);
  });
});

// describe('Auth endpoints', async () => {
//   describe('[POST] /api/auth/register', () => {
//     let newUser;
//     let res;
//     beforeEach(async () => {
//       res = await request(server)
//         .post('/api/auth/register')
//         .send({ username: 'test-user', password: 'Test1234.', email: 'test@email.com' });
//       newUser = await db('user').where('username', 'test-user').first();
//       it('registers a new user to the db', async () => {
//         expect(newUser).toMatchObject({ username: 'test-user' });
//       });
//     });
//   });
// });
