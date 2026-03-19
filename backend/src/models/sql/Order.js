const postgresPool = require("../../config/postgres");

async function createOrder(client, userId, totalAmount) {
  const query = `
    INSERT INTO orders (user_id, total_amount)
    VALUES ($1, $2)
    RETURNING id, user_id, total_amount, created_at
  `;
  const { rows } = await client.query(query, [userId, totalAmount]);
  return rows[0];
}

async function getOrdersByUser(userId) {
  const query = `
    SELECT o.id, o.total_amount, o.created_at,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'productId', oi.product_id,
            'quantity', oi.quantity,
            'priceAtPurchase', oi.price_at_purchase
          )
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;
  const { rows } = await postgresPool.query(query, [userId]);
  return rows;
}

async function getDailyRevenueLast7Days() {
  const query = `
    SELECT DATE(created_at) AS day, ROUND(SUM(total_amount)::numeric, 2) AS revenue
    FROM orders
    WHERE created_at >= NOW() - INTERVAL '7 days'
    GROUP BY DATE(created_at)
    ORDER BY day ASC
  `;
  const { rows } = await postgresPool.query(query);
  return rows;
}

async function getTopSpenders(limit = 3) {
  const query = `
    SELECT u.id, u.name, u.email, ROUND(SUM(o.total_amount)::numeric, 2) AS total_spent
    FROM users u
    JOIN orders o ON o.user_id = u.id
    GROUP BY u.id, u.name, u.email
    ORDER BY total_spent DESC
    LIMIT $1
  `;
  const { rows } = await postgresPool.query(query, [limit]);
  return rows;
}

module.exports = {
  createOrder,
  getOrdersByUser,
  getDailyRevenueLast7Days,
  getTopSpenders
};
