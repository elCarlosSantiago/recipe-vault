const request = require('supertest');
const server = require('../server');
const { TEST_TOKEN, BAD_TOKEN } = require('../secrets');
// const db = require('../data/dbConfig');

describe('Recipe middleware', () => {
  describe('Unique recipe user permissions', () => {
    it('returns a 401 on correct user_id and wrong recipe_id', async () => {
      const resBadRecipeId = await request(server)
        .get('/api/recipes/100')
        .set('Authorization', TEST_TOKEN);

      expect(resBadRecipeId.status).toBe(401);
      expect(resBadRecipeId.body.message).toMatch(
        /this resource does not exist for user/i
      );
    });
    it('returns a 401 on correct recipe_id and wrong user_id', async () => {
      const resBadUserId = await request(server)
        .get('/api/recipes/1')
        .set('Authorization', BAD_TOKEN);

      expect(resBadUserId.status).toBe(401);
      expect(resBadUserId.body.message).toMatch(/this resource does not exist for user/i);
    });
  });
});
