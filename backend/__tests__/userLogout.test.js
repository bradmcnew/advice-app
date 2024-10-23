const logoutUserController = require("../src/controllers/auth/logoutUserController");

describe("logoutUserController", () => {
  let req, res, next;

  // Setup mock objects before each test
  beforeEach(() => {
    req = {
      // Mock the logout function provided by Passport.js
      logout: jest.fn((cb) => cb(null)),
      session: {
        // Mock the session destroy function
        destroy: jest.fn((cb) => cb(null)),
      },
    };
    res = {
      // Mock the clearCookie method to remove the session cookie
      clearCookie: jest.fn(),
      // Mock response methods for status and send
      status: jest.fn().mockReturnThis(), // Allow chaining
      send: jest.fn(),
    };
    next = jest.fn(); // Mock next middleware function
  });

  // Test case for successful logout
  test("should log out user and destroy session", async () => {
    await logoutUserController(req, res, next); // Call the controller

    // Verify that the logout method was called
    expect(req.logout).toHaveBeenCalled();

    // Verify that the session was destroyed
    expect(req.session.destroy).toHaveBeenCalled();

    // Check that the response status is set to 200
    expect(res.status).toHaveBeenCalledWith(200);

    // Verify that the response sends the success message
    expect(res.send).toHaveBeenCalledWith("Logged out successfully");
  });

  // Test case for handling logout errors
  test("should handle logout error", async () => {
    // Simulate an error during logout
    req.logout = jest.fn((cb) => cb(new Error("Logout error")));

    await logoutUserController(req, res, next); // Call the controller

    // Ensure that next is called with the error
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  // Test case for handling session destruction errors
  test("should handle session destruction error", async () => {
    // Simulate an error during session destruction
    req.session.destroy = jest.fn((cb) =>
      cb(new Error("Session destruction error"))
    );

    await logoutUserController(req, res, next); // Call the controller

    // Ensure that next is called with the error
    expect(next).toHaveBeenCalledWith(expect.any(Error));

    // Check that the error message is as expected
    const error = next.mock.calls[0][0];
    expect(error.message).toBe("Session destruction error");
  });
});
