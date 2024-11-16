// __tests__/auth/loginUser.test.js
const request = require("supertest");
const app = require("../../src/app"); // Import the Express app for testing
const { sequelize, User } = require("../../src/models/index.js"); // Import Sequelize models
const bcrypt = require("bcrypt");
const loginUserController = require("../../src/controllers/auth/loginUserController");

// Setup database before all tests
beforeAll(async () => {
  await sequelize.sync({ force: true }); // Ensure a clean state by resetting the database
});

// Clean up database after all tests
afterAll(async () => {
  await sequelize.close(); // Close database connection
});

// Clean up user data after each test
afterEach(async () => {
  await User.destroy({
    where: { username: "testuser" }, // Remove test user to ensure isolation of tests
  });
});

// Group tests for the login functionality
describe("api/users/auth/login", () => {
  // Clear any previous mocks before each test
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock function calls to avoid interference
  });

  // Test for successful login with valid credentials
  it("should login a user with valid credentials", async () => {
    // Register a test user
    const hashedPassword = await bcrypt.hash("securepassword", 10);
    await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password_hash: hashedPassword,
      role: "high_school",
    });

    // Attempt to login with valid credentials
    const loginRes = await request(app)
      .post("/api/users/auth/login")
      .send({
        username: "testuser",
        password: "securepassword",
      })
      .expect(200); // Expect successful login

    // Verify response structure and content
    expect(loginRes.body.message).toBe("Logged in successfully");
    expect(loginRes.body.user).toHaveProperty("id");
    expect(loginRes.body.user).toHaveProperty("username", "testuser");
    expect(loginRes.body.user).not.toHaveProperty("password"); // Ensure password is not returned
  });

  // Test for missing username or password
  it("should return error if username or password is missing", async () => {
    const res = await request(app)
      .post("/api/users/auth/login")
      .send({
        username: "testuser",
        // missing password
      })
      .expect(400); // Expect bad request due to validation error

    // Verify that errors are returned in the expected format
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Password is required", // Check specific error message
        }),
      ])
    );
  });

  // Test for incorrect credentials
  it("should return error if credentials are incorrect", async () => {
    // Ensure user is registered
    const hashedPassword = await bcrypt.hash("securepassword", 10);
    await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password_hash: hashedPassword,
      role: "high_school",
    });

    // Try to login with incorrect password
    const res = await request(app)
      .post("/api/users/auth/login")
      .send({
        username: "testuser",
        password: "wrongpassword",
      })
      .expect(401); // Expect unauthorized error

    // Verify the error message
    expect(res.body.message).toBe("username or password is incorrect.");
  });

  // Test for handling unexpected errors during authentication
  it("should return error if authentication fails", async () => {
    // Mock the User.findOne function to simulate an authentication error
    jest
      .spyOn(User, "findOne")
      .mockRejectedValue(new Error("Authentication error")); // Simulate an error condition

    // Simulate a request to the login endpoint
    const req = await request(app).post("/api/users/auth/login").send({
      username: "testuser",
      password: "securepassword",
    });

    const res = {};
    const next = jest.fn(); // Mock the next function to capture errors

    // Call the controller directly to test its behavior
    await loginUserController(req, res, next);

    // Verify that the next function was called with an error
    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0]; // Get the error passed to next
    expect(error).toBeInstanceOf(Error); // Check if it's an instance of Error
    expect(error.status).toBe(500); // Expect status code 500 for internal server error
    expect(error.message).toBe("Internal Server Error"); // Check error message
  });
});
