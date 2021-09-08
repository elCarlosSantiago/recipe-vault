const db = require('../data/dbConfig');

const addUser = async (user) => {
  const [newUser] = await db('user').insert(user, ['user_id', 'username', 'email']);
  return newUser;
};

module.exports = {
  addUser,
};
