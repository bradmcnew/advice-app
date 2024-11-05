const passport = require("passport");
const loginUserController = require("../../src/controllers/auth/loginUserController");
const { loginUser } = require("../../src/services/user/userLoginService");

// Mock the user login service for isolated testing
jest.mock("../src/services/userLoginService");

describe("loginUserController", () => {
  let req, res, next;

  beforeEach(() => {
    // Mocking the request object
    req = {
      logIn: jest.fn((user, cb) => cb(null)), // Mocking Passport's logIn method
      body: {
        username: "testuser",
        password: "testpassword",
      },
    };

    // Mocking the response object
    res = {
      status: jest.fn(() => res), // Allows chaining
      json: jest.fn(), // Mock json method
    };

    // Mocking the next function for error handling
    next = jest.fn();

    // Mock Passport's authenticate method for testing
    passport.authenticate = jest.fn().mockImplementation((strategy, cb) => {
      return (req, res, next) => {
        cb(null, { id: 1, username: "testuser" }, null); // Simulating successful authentication
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls and instances
    // Optional: add additional teardown logic here if needed
  });

  test("should successfully log in the user", async () => {
    // Mock loginUser to return a successful result
    const user = { id: 1, username: "testuser" };
    loginUser.mockResolvedValue({ success: true, user });

    // Call the controller
    await loginUserController(req, res, next);

    // Verify response status and json payload
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Logged in successfully",
      user,
    });

    // Verify that loginUser was called with correct arguments
    expect(loginUser).toHaveBeenCalledWith(req, res, next);
  });

  test("should handle login failure", async () => {
    // Simulating a login failure scenario
    loginUser.mockResolvedValue({
      success: false,
      message: "Invalid credentials",
    });

    await loginUserController(req, res, next);

    // Verify response for login failure
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });

    // Ensure loginUser was called
    expect(loginUser).toHaveBeenCalledWith(req, res, next);
  });

  test("should handle authentication errors", async () => {
    // Mocking the loginUser function to simulate an authentication error
    loginUser.mockRejectedValue(new Error("Authentication error"));

    await loginUserController(req, res, next);

    // Check that next was called with the error
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
