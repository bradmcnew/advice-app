const request = require("supertest");
const app = require("../../src/app"); // Adjust the path as needed
const { sequelize, User } = require("../../src/models"); // Adjust the path as needed

describe("api/users", () => {
  beforeEach(async () => {
    // Clean up test users before each test
    await User.destroy({
      where: {},
      cascade: true,
    });
  });

  afterAll(async () => {
    // Close the database connection
    await sequelize.close();
  });

  describe("POST /register", () => {
    const registerUser = async (userData) => {
      return await request(app).post("/api/users/register").send(userData);
    };
    it("should register a new user with valid data", async () => {
      const res = await registerUser({
        username: "testuser",
        email: "testuser@example.com",
        password: "securepassword",
        role: "high_school",
      });

      expect(res.status).toBe(201);

      // Verify the response structure and content
      expect(res.body.message).toBe("User registered successfully");
      expect(res.body.user).toHaveProperty("id"); // User should have an ID
      expect(res.body.user).toHaveProperty("username", "testuser"); // Username should match
      expect(res.body.user).toHaveProperty("email", "testuser@example.com"); // Email should match
      expect(res.body.user).toHaveProperty("role", "high_school"); // Role should match
      expect(res.body.user).not.toHaveProperty("password"); // Password should not be returned
    });

    it("should return error if required fields are missing", async () => {
      const res = await registerUser({
        username: "testuser",
        email: "testuser@example.com",
        // missing password and role
      });

      expect(res.status).toBe(400);

      // Verify that the response contains error information
      expect(res.body).toHaveProperty("errors");
    });

    it("should return error if user already exists", async () => {
      // Register a user for the first time
      const res1 = await registerUser({
        username: "testuser",
        email: "testuser@example.com",
        password: "securepassword",
        role: "high_school",
      });

      // Try to register the same user again
      const res2 = await registerUser({
        username: "testuser",
        email: "testuser@example.com",
        password: "securepassword",
        role: "high_school",
      });

      // Expect a 400 status for the duplicate registration
      expect(res2.status).toBe(400);
      expect(res2.body.message).toBe("User already exists"); // Check the error message
    });
  });
});
