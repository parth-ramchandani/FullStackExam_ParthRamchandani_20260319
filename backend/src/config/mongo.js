const mongoose = require("mongoose");

async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fullstack_exam";

  if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
    throw new Error(
      `Invalid MONGODB_URI format: "${mongoUri}". Use mongodb://... or mongodb+srv://...`
    );
  }

  await mongoose.connect(mongoUri);
}

module.exports = connectMongo;
