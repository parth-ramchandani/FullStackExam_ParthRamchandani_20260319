const request = require("supertest");
const app = require("../src/app");

describe("Auth endpoints", () => {
  test("register validates input", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "",
      email: "not-an-email",
      password: "123"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });
});
