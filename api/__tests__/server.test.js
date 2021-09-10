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
        username: 'test-user-3',
        password: 'Test1234.',
        email: 'test3@email.com',
      });
      newUser = await db('user').where('username', 'test-user-3').first();
    });
    it('registers a new user to the db', async () => {
      expect(newUser.username).toMatch(/test-user-3/i);
    });
    it('registers a hashed password to the db', async () => {
      expect(newUser.password).not.toBe('Test1234.');
    });
    it('returns a status 201', async () => {
      expect(res.status).toBe(201);
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
  describe('register payload duplicate', () => {
    it('responds with 401 and message if username taken', async () => {
      const resTakenUsername = await request(server).post('/api/auth/register').send({
        username: 'test-user',
        email: 'email@email.com',
        password: 'Test1234.',
      });
      expect(resTakenUsername.status).toBe(401);
      expect(resTakenUsername.body.message).toMatch(/username taken/i);
    });
    it('responds with 401 and message if email taken', async () => {
      const resTakenEmail = await request(server).post('/api/auth/register').send({
        username: 'testuser',
        email: 'test@email.com',
        password: 'Test1234.',
      });
      expect(resTakenEmail.status).toBe(401);
      expect(resTakenEmail.body.message).toMatch(/email taken/i);
    });
  });
  describe('register schema', () => {
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
      expect(resMissingUsername.body[0].msg).toMatch(
        /Username must be at least 4 characters/i
      );
      expect(resShortUsername.body[0].msg).toMatch(
        /Username must be at least 4 characters/i
      );
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
      expect(resMissingEmail.body[0].msg).toMatch(/Invalid Email/i);
      expect(resWrongEmail.body[0].msg).toMatch(/Invalid Email/i);
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
      expect(resMissingPassword.body[0].msg).toMatch(
        /Password must contain at least 8 characters, one uppercase, one number and one special case character/i
      );
      expect(resWrongPassword.body[0].msg).toMatch(
        /Password must contain at least 8 characters, one uppercase, one number and one special case character/i
      );
    });
  });
  describe('loginPayload', () => {
    it('responds with 400 on missing username or password', async () => {
      const resMissingUsername = await request(server).post('/api/auth/login').send({
        password: 'Test1234.',
      });
      const resMissingPassword = await request(server).post('/api/auth/login').send({
        username: 'test',
      });
      expect(resMissingUsername.status).toBe(400);
      expect(resMissingPassword.status).toBe(400);
      expect(resMissingUsername.body.message).toMatch(/username and password required/i);
      expect(resMissingPassword.body.message).toMatch(/username and password required/i);
    });
  });
  describe('checkUsernameExists', () => {
    it('responds with 401 on invalid username', async () => {
      const resInvalidUser = await request(server).post('/api/auth/login').send({
        username: 'wronguser',
        password: 'Test1234.',
      });
      expect(resInvalidUser.status).toBe(401);
      expect(resInvalidUser.body.message).toMatch(/invalid credentials/i);
    });
  });
  describe('loginValidation', () => {
    it('responds with 401 on invalid password', async () => {
      const resInvalidPass = await request(server).post('/api/auth/login').send({
        username: 'test-user',
        password: 'wrongpass',
      });
      expect(resInvalidPass.status).toBe(401);
      expect(resInvalidPass.body.message).toMatch(/invalid credentials/i);
    });
  });
  describe('restricted middleware', () => {
    it('responds with 401 and message when token is not provided', async () => {
      const resNoToken = await request(server).get('/api/auth/restricted');
      expect(resNoToken.status).toBe(401);
      expect(resNoToken.body.message).toMatch(/authorization token required/i);
    });
    it('responds with 401 and message if token is invalid', async () => {
      const badToken = 'this is a bad token';
      const resBadToken = await request(server)
        .get('/api/auth/restricted')
        .set('Authorization', badToken);
      expect(resBadToken.status).toBe(401);
      expect(resBadToken.body.message).toMatch(/invalid token/i);
    });
  });
});
