// tests/auth.test.js
const request = require("supertest");
const app = require("../src/app"); // Import your Express app
const { sequelize, User } = require("../src/models"); // Adjust the path as needed
const { saveResetToken } = require("../src/services/userForgotPasswordService");

describe("Auth Routes", () => {
  beforeAll(async () => {
    // Clear and recreate the User table for clean tests
    await User.sync({ force: true });
  });

  afterAll(async () => {
    // Close your database connection
    await User.sequelize.close();
  });

  afterEach(async () => {
    // Delete all test users after each test
    await User.destroy({ where: { email: "testuser@example.com" } });
  });

  describe("POST /api/users/auth/forgot-password", () => {
    it("should send a password reset email to the user", async () => {
      // Create a test user
      const userResponse = await request(app).post("/api/users/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "securepassword",
        role: "high_school",
      });

      // Send forgot-password request
      const response = await request(app)
        .post("/api/users/auth/forgot-password")
        .send({ email: userResponse.body.user.email });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Password reset email sent");
      // You can add more assertions to check if the email was sent, etc.
    });

    it("should return 404 if user does not exist", async () => {
      const response = await request(app)
        .post("/api/users/auth/forgot-password")
        .send({ email: "nonexistent@example.com" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });

    it("should return 429 when rate limit is exceeded", async () => {
      const email = "testuser@example.com";

      // Create the user first
      await request(app).post("/api/users/register").send({
        username: "testuser",
        email,
        password: "securepassword",
        role: "high_school",
      });

      // Send 5 requests to hit the rate limit
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post("/api/users/auth/forgot-password")
          .send({ email });
      }

      // The 6th request should hit the rate limit
      const response = await request(app)
        .post("/api/users/auth/forgot-password")
        .send({ email });

      expect(response.status).toBe(429);
      expect(response.body.message).toBe(
        "Too many password reset attempts. Please try again later."
      );
    });
  });

  describe("POST /api/users/auth/reset-password", () => {
    it("should reset the user's password", async () => {
      // Create a test user
      const userResponse = await request(app).post("/api/users/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "securepassword",
        role: "high_school",
      });
      const user = await User.findByPk(userResponse.body.user.id);

      // Simulate sending a reset token
      const token = "someValidToken"; // Use a valid token here
      await saveResetToken(user, token);

      const response = await request(app)
        .post(`/api/users/auth/reset-password/${token}`)
        .send({
          newPassword: "newPassword123", // Ensure this meets your validation rules
          confirmPassword: "newPassword123", // This should match newPassword
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Password reset successfully");

      // Verify the password has been updated (ensure to check hashes)
      const updatedUser = await User.findOne({ where: { email: user.email } });
      expect(updatedUser.password_hash).not.toBe(user.password_hash);
    });

    it("should return 400 if the token is invalid or expired", async () => {
      const userResponse = await request(app).post("/api/users/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "securepassword",
        role: "high_school",
      });
      const user = await User.findByPk(userResponse.body.user.id);

      // Use an expired token
      const expiredToken = "expiredToken";

      await saveResetToken(user, expiredToken);

      // Simulating expiration by altering the token expiration date directly
      user.reset_token_expiration = new Date(Date.now() - 1000); // Set expiration in the past
      await user.save();

      const response = await request(app)
        .post(`/api/users/auth/reset-password/${expiredToken}`)
        .send({
          newPassword: "newPassword123",
          confirmPassword: "newPassword123",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid or expired token");
    });

    it("should return 400 if new password is missing", async () => {
      const response = await request(app)
        .post("/api/users/auth/reset-password/validToken")
        .send({
          confirmPassword: "newPassword",
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: "Password is required" }),
        ])
      );
    });

    it("should return 400 if confirmPassword is missing", async () => {
      const response = await request(app)
        .post("/api/users/auth/reset-password/validToken")
        .send({
          newPassword: "newPassword",
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: "Confirmation password is required" }),
        ])
      );
    });

    it("should return 400 if confirmPassword does not match newPassword", async () => {
      const userResponse = await request(app).post("/api/users/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "securepassword",
        role: "high_school",
      });
      const user = await User.findByPk(userResponse.body.user.id);

      // Simulate sending a reset token
      const token = "someValidToken"; // Use a valid token here
      await saveResetToken(user, token);

      const response = await request(app)
        .post(`/api/users/auth/reset-password/${token}`)
        .send({
          newPassword: "newPassword123",
          confirmPassword: "differentPassword", // This should not match
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Password confirmation does not match.",
          }),
        ])
      );
    });
  });
});
