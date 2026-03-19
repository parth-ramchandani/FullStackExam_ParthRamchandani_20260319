require("dotenv").config();
const connectMongo = require("../config/mongo");
const Product = require("../models/mongo/Product");

const sampleProducts = [
  {
    name: "Everyday Hoodie",
    description: "Comfortable cotton hoodie for daily wear.",
    category: "Apparel",
    price: 39.99,
    stock: 25,
    imageUrl: "https://picsum.photos/seed/hoodie/400/300"
  },
  {
    name: "Wireless Keyboard",
    description: "Slim mechanical-feel keyboard with long battery life.",
    category: "Electronics",
    price: 59.0,
    stock: 15,
    imageUrl: "https://picsum.photos/seed/keyboard/400/300"
  },
  {
    name: "Desk Lamp",
    description: "Warm LED desk lamp with touch brightness controls.",
    category: "Home",
    price: 22.5,
    stock: 40,
    imageUrl: "https://picsum.photos/seed/lamp/400/300"
  }
];

async function runSeed() {
  try {
    await connectMongo();
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log("Seeded sample products.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed products:", error);
    process.exit(1);
  }
}

runSeed();
