// userLoginAuth.test.js

/**
 * @file User Login Authentication Tests
 * @description Test suite for user login authentication controller and service
 */

const passport = require("passport");
const loginUserController = require("../../src/controllers/auth/loginUserController");
const { loginUser } = require("../../src/services/user/userLoginService");

// Mock the login service to isolate controller testing
jest.mock("../../src/services/user/userLoginService");

describe("loginUserController", () => {
  let req, res, next;

  beforeEach(() => {
    // Setup test request object with required properties and mocked session
    req = {
      logIn: jest.fn((user, cb) => cb(null)),
      body: {
        username: "testuser",
        password: "testpassword",
      },
      // Mock session object for authentication state management
      session: {
        destroy: jest.fn((cb) => cb(null)),
      },
      // Mock user object matching database model structure
      user: {
        dataValues: {
          id: 1,
          username: "testuser",
          email: "test@example.com",
          password_hash: "hashedpassword", // Should be excluded from responses
          role: "college_student",
          created_at: new Date(),
          updated_at: new Date(),
          reset_token: null,
          reset_token_expiration: null,
          google_id: null,
        },
      },
    };

    // Setup mock response object with chainable methods
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  // Clear all mocks after each test to prevent state leakage
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * @test Successful login flow
   * @description Tests the happy path where user credentials are valid
   */
  test("should successfully log in the user", async () => {
    // Prepare expected user data excluding sensitive fields
    const userData = {
      username: "testuser",
      role: "college_student",
    };

    // Mock successful login response
    loginUser.mockResolvedValue({
      success: true,
      userData,
    });

    await loginUserController(req, res, next);

    // Verify successful response with correct status and data
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Logged in successfully",
      user: userData,
    });
    expect(loginUser).toHaveBeenCalledWith(req, res, next);
  });

  /**
   * @test Failed login handling
   * @description Tests invalid credentials scenario
   */
  test("should handle login failure", async () => {
    // Mock authentication failure
    loginUser.mockResolvedValue({
      success: false,
      message: "Invalid credentials",
    });

    await loginUserController(req, res, next);

    // Verify unauthorized response
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid credentials",
    });
  });

  /**
   * @test Server error handling
   * @description Tests internal server error scenarios
   */
  test("should handle server errors", async () => {
    // Mock server error
    loginUser.mockRejectedValue(new Error("Server error"));

    await loginUserController(req, res, next);

    // Verify error response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred during login.",
    });
  });
});
