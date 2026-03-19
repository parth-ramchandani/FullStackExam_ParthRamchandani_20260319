require("dotenv").config();
const app = require("./app");
const connectMongo = require("./config/mongo");
const postgresPool = require("./config/postgres");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectMongo();
    await postgresPool.query("SELECT 1");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
