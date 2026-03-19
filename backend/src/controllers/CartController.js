const mongoose = require("mongoose");
const Cart = require("../models/mongo/Cart");
const Product = require("../models/mongo/Product");

async function getCart(req, res) {
  const cart = await Cart.findOne({ userId: req.user.userId }).lean();
  return res.status(200).json(cart || { userId: req.user.userId, items: [] });
}

async function addToCart(req, res) {
  try {
    const { productId, quantity } = req.body;
    const normalizedQty = Number(quantity || 1);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    let cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => String(item.productId) === productId);
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += normalizedQty;
    } else {
      cart.items.push({ productId, quantity: normalizedQty });
    }

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Failed to add item to cart.", error: error.message });
  }
}

async function removeFromCart(req, res) {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    cart.items = cart.items.filter((item) => String(item.productId) !== productId);
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove item from cart.", error: error.message });
  }
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart
};
