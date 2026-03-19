const postgresPool = require("../../config/postgres");

async function createUser({ name, email, passwordHash }) {
  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at
  `;
  const values = [name, email, passwordHash];
  const { rows } = await postgresPool.query(query, values);
  return rows[0];
}

async function findByEmail(email) {
  const { rows } = await postgresPool.query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await postgresPool.query(
    "SELECT id, name, email, created_at FROM users WHERE id = $1",
    [id]
  );
  return rows[0] || null;
}

module.exports = {
  createUser,
  findByEmail,
  findById
};
