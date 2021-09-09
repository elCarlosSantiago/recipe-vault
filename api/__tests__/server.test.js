const request = require('supertest');
const server = require('../server');

const db = require('../data/dbConfig');
const { default: jwtDecode } = require('jwt-decode');

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
    expect(process.env.NODE_ENV).toBe('testing');
  });

  it('responds with api up on / request', async () => {
    const res = await request(server).get('/');
    expect(res.body).toMatchObject({ api: 'up' });
    expect(res.status).toBe(200);
  });
});

describe('Auth endpoints', () => {
  describe('[POST] /api/auth/register', () => {
    let newUser;
    let res;
    beforeEach(async () => {
      res = await request(server).post('/api/auth/register').send({
        username: 'test-user-2',
        password: 'Test1234.',
        email: 'test2@email.com',
      });
      newUser = await db('user').where('username', 'test-user').first();
    });
    it('registers a new user to the db', async () => {
      expect(newUser).toMatchObject({ username: 'test-user' });
    });
    it('registers a hashed password to the db', async () => {
      expect(newUser.password).not.toBe('Test1234.');
    });
    it('returns a status 201', async () => {
      expect(res.status).toBe(201);
    });

    it('returns a 401 if username is taken', async () => {
      const repeatRes = await request(server).post('/api/auth/register').send({
        username: 'test-user-2',
        password: 'Test1234.',
        email: 'test3@email.com',
      });
      expect(repeatRes.status).toBe(401);
    });
    it('returns a 401 if email is taken', async () => {
      const repeatRes = await request(server).post('/api/auth/register').send({
        username: 'test-user-3',
        password: 'Test1234.',
        email: 'test2@email.com',
      });
      expect(repeatRes.status).toBe(401);
    });
  });
  describe('[POST] /api/auth/login', () => {
    let res;
    beforeEach(async () => {
      res = await request(server).post('/api/auth/login').send({
        username: 'test-user',
        password: 'Test1234.',
      });
    });
    it('returns message on valid credentials', async () => {
      expect(res.body.message).toMatch(/welcome test-user!/i);
    });
    it('returns username and id on valid credentials', async () => {
      expect(res.body.username).toMatch(/test-user/i);
      const [{ user_id }] = await db
        .select('user_id')
        .from('user')
        .where('username', 'test-user');
      expect(res.body.user_id).toEqual(user_id);
    });
    it('returns a valid token on login', async () => {
      let decodedJwt = jwtDecode(res.body.token);
      expect(decodedJwt).toHaveProperty('iat');
      expect(decodedJwt).toHaveProperty('exp');
      expect(decodedJwt).toMatchObject({
        subject: 1,
        username: 'test-user',
        user_id: 1,
      });
    });
  });
});

describe('Auth middleware', () => {
  describe('registerPayloadDuplicate', () => {
    it('responds with 401 and message if username is missing or less than four characters', async () => {
      const resMissingUsername = await request(server).post('/api/auth/register').send({
        password: '1234',
        email: 'test@email.com',
      });
      const resShortUsername = await request(server).post('/api/auth/register').send({
        username: 'ay',
        password: 'Test1234.',
        email: 'test@gmail.com',
      });
      expect(resMissingUsername.status).toBe(401);
      expect(resShortUsername.status).toBe(401);
      expect(resMissingUsername.body[0]).toMatchObject({
        msg: /Username must be at least 4 characters/i,
      });
      expect(resShortUsername.body[0]).toMatchObject({
        msg: /Username must be at least 4 characters/i,
      });
    });
    it('responds with 401 and message if email is missing', async () => {
      const resMissingEmail = await request(server).post('/api/auth/register').send({
        username: 'test',
        password: 'Test1234.',
      });
      const resWrongEmail = await request(server).post('/api/auth/register').send({
        username: 'test',
        password: 'Test1234.',
        email: 'email',
      });
      expect(resMissingEmail.status).toBe(401);
      expect(resWrongEmail.status).toBe(401);
      expect(resMissingEmail.body[0]).toMatchObject({
        msg: /Invalid email/i,
      });
      expect(resWrongEmail.body[0]).toMatchObject({
        msg: /Invalid email/i,
      });
    });
    it('responds with 401 and message if password is missing or does not meet reqs', async () => {
      const resMissingPassword = await request(server).post('/api/auth/register').send({
        username: 'test',
        email: 'test@email.com',
      });
      const resWrongPassword = await request(server).post('/api/auth/register').send({
        username: 'test',
        email: 'test@email.com',
        password: 'tes',
      });
      expect(resMissingPassword.status).toBe(401);
      expect(resWrongPassword.status).toBe(401);
      expect(resMissingPassword.body[0]).toMatchObject({
        msg: /Password must contain at least 8 characters, one uppercase, one number and one special case character/i,
      });
      expect(resWrongPassword.body[0]).toMatchObject({
        msg: /Password must contain at least 8 characters, one uppercase, one number and one special case character/i,
      });
    });
  });
});
