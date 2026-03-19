const jwt = require("jsonwebtoken");

function createAuthToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

module.exports = {
  createAuthToken
};
