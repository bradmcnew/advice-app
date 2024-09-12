const request = require("supertest");
const app = require("../src/app");

describe("GET /api/users", () => {
  it("should return a message", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Users endpoint");
  });
});
