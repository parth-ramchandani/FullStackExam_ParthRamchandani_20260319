const bcrypt = require("bcryptjs");
const { createAuthToken } = require("../utils/jwt");
const UserModel = require("../models/sql/User");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.createUser({ name, email, passwordHash });
    const token = createAuthToken({ userId: user.id, email: user.email });

    return res.status(201).json({ user, token });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register user.", error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createAuthToken({ userId: user.id, email: user.email });
    return res.status(200).json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login.", error: error.message });
  }
}

module.exports = {
  register,
  login
};
