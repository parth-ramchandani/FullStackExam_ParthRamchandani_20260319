const Product = require("../models/mongo/Product");
const OrderModel = require("../models/sql/Order");

async function getReports(req, res) {
  try {
    const [dailyRevenue, topSpenders, productsByCategory] = await Promise.all([
      OrderModel.getDailyRevenueLast7Days(),
      OrderModel.getTopSpenders(3),
      Product.aggregate([
        {
          $group: {
            _id: "$category",
            totalProducts: { $sum: 1 },
            averagePrice: { $avg: "$price" },
            totalStock: { $sum: "$stock" }
          }
        },
        { $sort: { totalProducts: -1 } }
      ])
    ]);

    return res.status(200).json({
      sql: {
        dailyRevenue,
        topSpenders
      },
      mongo: {
        productsByCategory
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch reports.", error: error.message });
  }
}

module.exports = {
  getReports
};
