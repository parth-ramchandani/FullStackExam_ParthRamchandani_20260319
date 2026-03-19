jest.mock("../src/config/postgres", () => ({
  connect: jest.fn()
}));
jest.mock("../src/models/mongo/Cart", () => ({
  findOne: jest.fn(),
  updateOne: jest.fn()
}));
jest.mock("../src/models/mongo/Product", () => ({
  find: jest.fn(),
  updateOne: jest.fn()
}));
jest.mock("../src/models/sql/Order", () => ({
  createOrder: jest.fn()
}));
jest.mock("../src/models/sql/OrderItem", () => ({
  createOrderItems: jest.fn()
}));

const postgresPool = require("../src/config/postgres");
const Cart = require("../src/models/mongo/Cart");
const Product = require("../src/models/mongo/Product");
const OrderModel = require("../src/models/sql/Order");
const OrderItemModel = require("../src/models/sql/OrderItem");
const { checkout } = require("../src/controllers/OrderController");

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };
}

describe("OrderController.checkout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 400 when cart is empty", async () => {
    const client = { query: jest.fn(), release: jest.fn() };
    postgresPool.connect.mockResolvedValue(client);
    Cart.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

    const req = { user: { userId: 7 } };
    const res = mockRes();

    await checkout(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Cart is empty." });
    expect(client.release).toHaveBeenCalled();
  });

  test("creates order and clears cart on successful checkout", async () => {
    const client = { query: jest.fn(), release: jest.fn() };
    postgresPool.connect.mockResolvedValue(client);

    Cart.findOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        items: [{ productId: "66b0f4f1234567890abcde12", quantity: 2 }]
      })
    });
    Product.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue([
        { _id: "66b0f4f1234567890abcde12", name: "Desk Lamp", price: 25, stock: 10 }
      ])
    });
    OrderModel.createOrder.mockResolvedValue({ id: 11 });
    OrderItemModel.createOrderItems.mockResolvedValue();
    Product.updateOne.mockResolvedValue();
    Cart.updateOne.mockResolvedValue();

    const req = { user: { userId: 7 } };
    const res = mockRes();

    await checkout(req, res);

    expect(client.query).toHaveBeenNthCalledWith(1, "BEGIN");
    expect(client.query).toHaveBeenNthCalledWith(2, "COMMIT");
    expect(OrderModel.createOrder).toHaveBeenCalledWith(client, 7, 50);
    expect(OrderItemModel.createOrderItems).toHaveBeenCalled();
    expect(Cart.updateOne).toHaveBeenCalledWith({ userId: 7 }, { $set: { items: [] } });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(client.release).toHaveBeenCalled();
  });
});
