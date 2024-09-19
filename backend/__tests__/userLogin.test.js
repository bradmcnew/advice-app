const passport = require("passport");
const loginUserController = require("../src/controllers/loginUserController");
const { loginUser } = require("../src/services/userLoginService");

jest.mock("../src/services/userLoginService");

describe("loginUserController", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      logIn: jest.fn((user, cb) => cb(null)),
      body: {
        username: "testuser",
        password: "testpassword",
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();

    // Mock passport.authenticate
    passport.authenticate = jest.fn().mockImplementation((strategy, cb) => {
      return (req, res, next) => {
        cb(null, { id: 1, username: "testuser" }, null);
      };
    });
  });

  test("should successfully log in the user", async () => {
    // Mock loginUser to return a successful result
    const user = { id: 1, username: "testuser" };
    loginUser.mockResolvedValue({ success: true, user });

    // Call the controller
    await loginUserController(req, res, next);

    // Check that res.status and res.json were called correctly
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Logged in successfully",
      user,
    });

    expect(loginUser).toHaveBeenCalledWith(req, res, next);
  });

  test("should handle login failure", async () => {
    loginUser.mockResolvedValue({
      success: false,
      message: "Invalid credentials",
    });

    await loginUserController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });

    expect(loginUser).toHaveBeenCalledWith(req, res, next);
  });

  test("should handle authentication errors", async () => {
    // Mock Passport.js to call the callback with an error
    loginUser.mockRejectedValue(new Error("Authentication error"));

    await loginUserController(req, res, next);

    // Check that next was called with the error
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
