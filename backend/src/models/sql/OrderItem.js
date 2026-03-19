async function createOrderItems(client, orderId, items) {
  const query = `
    INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
    VALUES ($1, $2, $3, $4)
  `;

  for (const item of items) {
    await client.query(query, [orderId, item.productId, item.quantity, item.priceAtPurchase]);
  }
}

module.exports = {
  createOrderItems
};
