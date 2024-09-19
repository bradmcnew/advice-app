const request = require("supertest");
const app = require("../src/app"); // Adjust the path as needed
const { sequelize, User } = require("../src/models"); // Adjust the path as needed

beforeAll(async () => {
  // Sync the database before running tests
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection after tests
  await sequelize.close();
});

describe("api/users", () => {
  describe("POST /register", () => {
    it("should register a new user with valid data", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({
          username: "testuser",
          email: "testuser@example.com",
          password: "securepassword",
          role: "high_school",
        })
        .expect(201);

      expect(res.body.message).toBe("User registered successfully");
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user).toHaveProperty("username", "testuser");
      expect(res.body.user).toHaveProperty("email", "testuser@example.com");
      expect(res.body.user).toHaveProperty("role", "high_school");
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should return error if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({
          username: "testuser",
          email: "testuser@example.com",
          // missing password and role
        })
        .expect(400);

      expect(res.body).toHaveProperty("errors");
    });

    it("should return error if user already exists", async () => {
      await request(app).post("/api/users/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "securepassword",
        role: "high_school",
      });

      // Try to register the same user again
      const res = await request(app).post("/api/users/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password",
        role: "high_school",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("User already exists");
    });
  });
});
