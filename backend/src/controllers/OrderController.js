const postgresPool = require("../config/postgres");
const Cart = require("../models/mongo/Cart");
const Product = require("../models/mongo/Product");
const OrderModel = require("../models/sql/Order");
const OrderItemModel = require("../models/sql/OrderItem");

async function checkout(req, res) {
  const userId = req.user.userId;
  const client = await postgresPool.connect();

  try {
    const cart = await Cart.findOne({ userId }).lean();
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const productIds = cart.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = new Map(products.map((product) => [String(product._id), product]));

    const lineItems = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = productMap.get(String(cartItem.productId));
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product missing during checkout: ${cartItem.productId}` });
      }

      if (product.stock < cartItem.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}.` });
      }

      const lineTotal = product.price * cartItem.quantity;
      totalAmount += lineTotal;
      lineItems.push({
        productId: String(product._id),
        quantity: cartItem.quantity,
        priceAtPurchase: product.price
      });
    }

    await client.query("BEGIN");

    const order = await OrderModel.createOrder(client, userId, totalAmount);
    await OrderItemModel.createOrderItems(client, order.id, lineItems);
    await client.query("COMMIT");

    // Keep product stock accurate after successful SQL order creation.
    for (const item of lineItems) {
      await Product.updateOne({ _id: item.productId }, { $inc: { stock: -item.quantity } });
    }

    await Cart.updateOne({ userId }, { $set: { items: [] } });

    return res.status(201).json({ orderId: order.id, totalAmount, items: lineItems });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ message: "Checkout failed.", error: error.message });
  } finally {
    client.release();
  }
}

async function getOrderHistory(req, res) {
  try {
    const orders = await OrderModel.getOrdersByUser(req.user.userId);
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders.", error: error.message });
  }
}

module.exports = {
  checkout,
  getOrderHistory
};
