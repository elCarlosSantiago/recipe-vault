require('dotenv').config();
const server = require('./api/server');
const { PORT } = require('./api/secrets');

server.listen(PORT, () => {
  if (PORT === 3300) {
    console.log(`SET UP ENV Listening on port ${PORT}...`);
  } else {
    console.log(`Listening on port ${PORT}`);
  }
});
