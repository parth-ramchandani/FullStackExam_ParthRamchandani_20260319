const { Pool } = require("pg");

const postgresPool = new Pool({
  connectionString: process.env.POSTGRES_URI
});

module.exports = postgresPool;
