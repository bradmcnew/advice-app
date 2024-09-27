const request = require("supertest");
const app = require("../src/app"); // Adjust the path as needed
const { sequelize, User } = require("../src/models"); // Adjust the path as needed

beforeAll(async () => {
  // Sync the database before running tests to ensure a clean state
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close the database connection after all tests are complete
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
        .expect(201); // Expect a 201 Created status

      // Verify the response structure and content
      expect(res.body.message).toBe("User registered successfully");
      expect(res.body.user).toHaveProperty("id"); // User should have an ID
      expect(res.body.user).toHaveProperty("username", "testuser"); // Username should match
      expect(res.body.user).toHaveProperty("email", "testuser@example.com"); // Email should match
      expect(res.body.user).toHaveProperty("role", "high_school"); // Role should match
      expect(res.body.user).not.toHaveProperty("password"); // Password should not be returned
    });

    it("should return error if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({
          username: "testuser",
          email: "testuser@example.com",
          // missing password and role
        })
        .expect(400); // Expect a 400 Bad Request status

      // Verify that the response contains error information
      expect(res.body).toHaveProperty("errors");
    });

    it("should return error if user already exists", async () => {
      // Register a user for the first time
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

      // Expect a 400 status for the duplicate registration
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("User already exists"); // Check the error message
    });
  });
});
