const Product = require("../models/mongo/Product");

async function listProducts(req, res) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 8);
    const search = (req.query.search || "").trim();
    const category = (req.query.category || "").trim();

    const skip = (page - 1) * limit;
    const pipeline = [];

    if (search) {
      pipeline.push({ $match: { $text: { $search: search } } });
    }

    if (category) {
      pipeline.push({ $match: { category: new RegExp(`^${category}$`, "i") } });
    }

    pipeline.push({
      $facet: {
        data: [{ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "total" }]
      }
    });

    const [result] = await Product.aggregate(pipeline);
    const products = result?.data || [];
    const total = result?.totalCount?.[0]?.total || 0;

    return res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      products
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch products.", error: error.message });
  }
}

async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch product.", error: error.message });
  }
}

async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: "Invalid product payload.", error: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ message: "Invalid update payload.", error: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete product.", error: error.message });
  }
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
