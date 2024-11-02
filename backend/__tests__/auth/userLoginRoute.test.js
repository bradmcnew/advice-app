const request = require("supertest");
const app = require("../../src/app");
const { sequelize, User } = require("../../src/models");
const bcrypt = require("bcrypt");

describe("api/users/auth/login", () => {
  console.log("NODE_ENV: ", process.env.NODE_ENV);

  beforeEach(async () => {
    await User.destroy({
      where: { username: "testuser" },
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should login a user with valid credentials", async () => {
    const hashedPassword = await bcrypt.hash("securepassword", 10);
    await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password_hash: hashedPassword,
      role: "high_school",
    });

    const res = await request(app).post("/api/users/auth/login").send({
      username: "testuser",
      password: "securepassword",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Logged in successfully",
      user: expect.objectContaining({
        username: "testuser",
        role: "high_school",
      }),
    });
  });

  it("should return error if username or password is missing", async () => {
    const res = await request(app).post("/api/users/auth/login").send({
      username: "testuser",
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("should return error if credentials are incorrect", async () => {
    const hashedPassword = await bcrypt.hash("securepassword", 10);
    await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password_hash: hashedPassword,
      role: "high_school",
    });

    const res = await request(app).post("/api/users/auth/login").send({
      username: "testuser",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("username or password is incorrect.");
  });

  it("should return error if authentication fails", async () => {
    // Use supertest instead of direct controller call
    jest.spyOn(User, "findOne").mockRejectedValue(new Error("Database error"));

    const res = await request(app).post("/api/users/auth/login").send({
      username: "testuser",
      password: "securepassword",
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("An error occurred during login.");

    jest.restoreAllMocks();
  });
});
