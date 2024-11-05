/**
 * @file viewProfile.test.js
 * @description Integration tests for the user profile viewing functionality
 * @requires supertest-session For handling authenticated sessions
 * @requires bcrypt For password hashing in test setup
 */
const request = require("supertest");
const session = require("supertest-session");
const bcrypt = require("bcrypt");
const app = require("../../src/app");
const { User, UserProfile, sequelize } = require("../../src/models");

describe("GET /api/profile", () => {
  /**
   * Test fixtures and setup
   * @type {Object} testSession - Authenticated session for testing
   * @type {Object} testUser - Test user record
   * @type {Object} testProfile - Test user profile record
   */
  let testSession;
  let testUser;
  let testProfile;

  /**
   * Setup before each test:
   * 1. Creates a test user with hashed password
   * 2. Creates associated profile
   * 3. Establishes authenticated session
   */
  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
      });

      /**
       * @test
       * @description Verifies that high school user profiles are retrieved correctly
       * @expects 200 status code
       * @expects Complete profile data in response
       */
      it("should fetch high school user profile successfully", async () => {
        const res = await testSession.get("/api/profile").expect(200);

        expect(res.body).toEqual({
          username: "testuser",
          email: "test@example.com",
          first_name: "Test",
          last_name: "User",
          bio: "Test bio",
          phone_number: "1234567890",
          location: "Test City",
          profile_picture: "test.jpg",
          social_media_links: { twitter: "@test" },
          message: "This is a high school user profile",
        });
      });

      /**
       * @test
       * @description Verifies college student profiles include additional fields
       * @expects 200 status code
       * @expects Additional college-specific fields in response
       */
      it("should fetch college student profile with additional fields", async () => {
        await testUser.update({ role: "college_student" });
        await testProfile.update({
          resume: "resume.pdf",
          skills: ["JavaScript", "React"],
          availability: true,
        });

        await testSession.post("/api/users/auth/logout");
        await testSession
          .post("/api/users/auth/login")
          .send({
            username: "testuser",
            password: "password123",
          })
          .expect(200);

        const res = await testSession.get("/api/profile").expect(200);

        expect(res.body).toEqual({
          username: "testuser",
          email: "test@example.com",
          first_name: "Test",
          last_name: "User",
          bio: "Test bio",
          phone_number: "1234567890",
          location: "Test City",
          profile_picture: "test.jpg",
          social_media_links: { twitter: "@test" },
          resume: "resume.pdf",
          skills: ["JavaScript", "React"],
          availability: true,
          message: "This is a college student user profile",
        });
      });

      /**
       * @test
       * @description Verifies authentication requirement
       * @expects 401 status code for unauthenticated requests
       */
      it("should return 401 if not authenticated", async () => {
        await testSession.post("/api/users/auth/logout");
        const unauthenticatedSession = session(app);
        const res = await unauthenticatedSession.get("/api/profile").expect(401);

        expect(res.body).toEqual({
          authenticated: false,
        });
      });

      /**
       * @test
       * @description Verifies handling of non-existent profiles
       * @expects 404 status code when profile doesn't exist
       */
      it("should return 404 if profile not found", async () => {
        await UserProfile.destroy({ where: { user_id: testUser.id } });

        await testSession.post("/api/users/auth/login").send({
          username: "testuser",
          password: "password123",
        });
        const res = await testSession.get("/api/profile").expect(404);

        expect(res.body).toEqual({
          message: "User profile not found",
        });
      });

      /**
       * @test
       * @description Verifies proper error handling for database failures
       * @expects 500 status code
       * @expects Error message in response
       */
      it("should handle database errors gracefully", async () => {
        jest
          .spyOn(UserProfile, "findOne")
          .mockRejectedValue(new Error("Database error"));

        const res = await testSession.get("/api/profile").expect(500);

        expect(res.body).toEqual({
          message: "Internal Server Error",
        });
      });

      /**
       * @test
       * @description Verifies handling of profiles with missing optional fields
       * @expects 200 status code
       * @expects Required fields present in response
       */
      it("should handle profile with missing optional fields", async () => {
        await testProfile.update({
          bio: null,
          phone_number: null,
          profile_picture: null,
          social_media_links: null,
        });

        const res = await testSession.get("/api/profile").expect(200);

        expect(res.body).toMatchObject({
          username: "testuser",
          email: "test@example.com",
          first_name: "Test",
          last_name: "User",
        });
      });

      /**
       * @test
       * @description Verifies handling of expired sessions
       * @expects 401 status code after session expiry
       */
      it("should handle expired session", async () => {
        // Destroy session
        await testSession.post("/api/users/auth/logout");

        const res = await testSession.get("/api/profile").expect(401);

        expect(res.body).toEqual({
          authenticated: false,
        });
      });

      /**
       * Cleanup after each test:
       * 1. Removes all test profiles
       * 2. Removes all test users
       * 3. Restores any mocked functions
       */
      afterEach(async () => {
        await UserProfile.destroy({ where: {} });
        await User.destroy({ where: {} });
        jest.restoreAllMocks();
      });
    });

    /**
     * Global cleanup after all tests complete
     * Closes database connection to prevent hanging handles
     */
    afterAll(async () => {
      await sequelize.close();
    });
        testUser = await User.create({
          username: "testuser",
          email: "test@example.com",
          password_hash: hashedPassword,
          role: "high_school",
        });

        testProfile = await UserProfile.create({
          user_id: testUser.id,
          first_name: "Test",
          last_name: "User",
          bio: "Test bio",
          phone_number: "1234567890",
          location: "Test City",
          profile_picture: "test.jpg",
          social_media_links: { twitter: "@test" },
        });

        testSession = session(app);
        await testSession
          .post("/api/users/auth/login")
          .send({
            username: "testuser",
            password: "password123",
          })
          .expect(200);
      });

      /**
       * @test
       * @description Verifies that high school user profiles are retrieved correctly
       * @expects 200 status code
       * @expects Complete profile data in response
       */
      it("should fetch high school user profile successfully", async () => {
        const res = await testSession.get("/api/profile").expect(200);

        expect(res.body).toEqual({
          username: "testuser",
          email: "test@example.com",
          first_name: "Test",
          last_name: "User",
          bio: "Test bio",
          phone_number: "1234567890",
          location: "Test City",
          profile_picture: "test.jpg",
          social_media_links: { twitter: "@test" },
          message: "This is a high school user profile",
        });
      });

      /**
       * @test
       * @description Verifies college student profiles include additional fields
       * @expects 200 status code
       * @expects Additional college-specific fields in response
       */
      it("should fetch college student profile with additional fields", async () => {
        await testUser.update({ role: "college_student" });
        await testProfile.update({
          resume: "resume.pdf",
          skills: ["JavaScript", "React"],
          availability: true,
        });

        await testSession.post("/api/users/auth/logout");
        await testSession
          .post("/api/users/auth/login")
          .send({
            username: "testuser",
            password: "password123",
          })
          .expect(200);

        const res = await testSession.get("/api/profile").expect(200);

        expect(res.body).toEqual({
          username: "testuser",
          email: "test@example.com",
          first_name: "Test",
          last_name: "User",
          bio: "Test bio",
          phone_number: "1234567890",
          location: "Test City",
          profile_picture: "test.jpg",
          social_media_links: { twitter: "@test" },
          resume: "resume.pdf",
          skills: ["JavaScript", "React"],
          availability: true,
          message: "This is a college student user profile",
        });
      });

      /**
       * @test
       * @description Verifies authentication requirement
       * @expects 401 status code for unauthenticated requests
       */
      it("should return 401 if not authenticated", async () => {
        await testSession.post("/api/users/auth/logout");
        const unauthenticatedSession = session(app);
        const res = await unauthenticatedSession
          .get("/api/profile")
          .expect(401);

        expect(res.body).toEqual({
          authenticated: false,
        });
      });

      /**
       * @test
       * @description Verifies handling of non-existent profiles
       * @expects 404 status code when profile doesn't exist
       */
      it("should return 404 if profile not found", async () => {
        await UserProfile.destroy({ where: { user_id: testUser.id } });

        await testSession.post("/api/users/auth/login").send({
          username: "testuser",
          password: "password123",
        });
        const res = await testSession.get("/api/profile").expect(404);

        expect(res.body).toEqual({
          message: "User profile not found",
        });
      });

      /**
       * @test
       * @description Verifies proper error handling for database failures
       * @expects 500 status code
       * @expects Error message in response
       */
      it("should handle database errors gracefully", async () => {
        jest
          .spyOn(UserProfile, "findOne")
          .mockRejectedValue(new Error("Database error"));

        const res = await testSession.get("/api/profile").expect(500);

        expect(res.body).toEqual({
          message: "Internal Server Error",
        });
      });

      /**
       * @test
       * @description Verifies handling of profiles with missing optional fields
       * @expects 200 status code
       * @expects Required fields present in response
       */
      it("should handle profile with missing optional fields", async () => {
        await testProfile.update({
          bio: null,
          phone_number: null,
          profile_picture: null,
          social_media_links: null,
        });

        const res = await testSession.get("/api/profile").expect(200);

        expect(res.body).toMatchObject({
          username: "testuser",
          email: "test@example.com",
          first_name: "Test",
          last_name: "User",
        });
      });

      /**
       * @test
       * @description Verifies handling of expired sessions
       * @expects 401 status code after session expiry
       */
      it("should handle expired session", async () => {
        // Destroy session
        await testSession.post("/api/users/auth/logout");

        const res = await testSession.get("/api/profile").expect(401);

        expect(res.body).toEqual({
          authenticated: false,
        });
      });

      /**
       * @test
       * @description Verifies handling of profiles with invalid data
       * @expects 400 status code
       * @expects Error message in response
       */
      it("should handle profile with invalid data", async () => {
        await testProfile.update({
          bio: "a".repeat(501),
        });

        const res = await testSession.get("/api/profile").expect(400);

        expect(res.body.errors).toContainEqual(
          expect.objectContaining({
            msg: "Bio must not exceed 500 characters",
          })
        );
      });

      /**
       * @test
       * @description Verifies handling of profiles with missing required fields
       * @expects 400 status code
       * @expects Error message in response
       */
      it("should handle profile with missing required fields", async () => {
        await testProfile.update({
          first_name: null,
        });

        const res = await testSession.get("/api/profile").expect(400);

        expect(res.body.errors).toContainEqual(
          expect.objectContaining({
            msg: "First name is required",
          })
        );
      });

      /**
       * Cleanup after each test:
       * 1. Removes all test profiles
       * 2. Removes all test users
       * 3. Restores any mocked functions
       */
      afterEach(async () => {
        await UserProfile.destroy({ where: {} });
        await User.destroy({ where: {} });
        jest.restoreAllMocks();
      });
    });

    /**
     * Global cleanup after all tests complete
     * Closes database connection to prevent hanging handles
     */
    afterAll(async () => {
      await sequelize.close();
    });
  });

  /**
   * @test
   * @description Verifies college student profiles include additional fields
   * @expects 200 status code
   * @expects Additional college-specific fields in response
   */
  it("should fetch college student profile with additional fields", async () => {
    await testUser.update({ role: "college_student" });
    await testProfile.update({
      resume: "resume.pdf",
      skills: ["JavaScript", "React"],
      availability: true,
    });

    await testSession.post("/api/users/auth/logout");
    await testSession
      .post("/api/users/auth/login")
      .send({
        username: "testuser",
        password: "password123",
      })
      .expect(200);

    const res = await testSession.get("/api/profile").expect(200);

    expect(res.body).toEqual({
      username: "testuser",
      email: "test@example.com",
      first_name: "Test",
      last_name: "User",
      bio: "Test bio",
      phone_number: "1234567890",
      location: "Test City",
      profile_picture: "test.jpg",
      social_media_links: { twitter: "@test" },
      resume: "resume.pdf",
      skills: ["JavaScript", "React"],
      availability: true,
      message: "This is a college student user profile",
    });
  });

  /**
   * @test
   * @description Verifies authentication requirement
   * @expects 401 status code for unauthenticated requests
   */
  it("should return 401 if not authenticated", async () => {
    await testSession.post("/api/users/auth/logout");
    const unauthenticatedSession = session(app);
    const res = await unauthenticatedSession.get("/api/profile").expect(401);

    expect(res.body).toEqual({
      authenticated: false,
    });
  });

  /**
   * @test
   * @description Verifies handling of non-existent profiles
   * @expects 404 status code when profile doesn't exist
   */
  it("should return 404 if profile not found", async () => {
    await UserProfile.destroy({ where: { user_id: testUser.id } });

    await testSession.post("/api/users/auth/login").send({
      username: "testuser",
      password: "password123",
    });
    const res = await testSession.get("/api/profile").expect(404);

    expect(res.body).toEqual({
      message: "User profile not found",
    });
  });

  /**
   * @test
   * @description Verifies proper error handling for database failures
   * @expects 500 status code
   * @expects Error message in response
   */
  it("should handle database errors gracefully", async () => {
    jest
      .spyOn(UserProfile, "findOne")
      .mockRejectedValue(new Error("Database error"));

    const res = await testSession.get("/api/profile").expect(500);

    expect(res.body).toEqual({
      message: "Internal Server Error",
    });
  });

  /**
   * @test
   * @description Verifies handling of profiles with missing optional fields
   * @expects 200 status code
   * @expects Required fields present in response
   */
  it("should handle profile with missing optional fields", async () => {
    await testProfile.update({
      bio: null,
      phone_number: null,
      profile_picture: null,
      social_media_links: null,
    });

    const res = await testSession.get("/api/profile").expect(200);

    expect(res.body).toMatchObject({
      username: "testuser",
      email: "test@example.com",
      first_name: "Test",
      last_name: "User",
    });
  });

  /**
   * @test
   * @description Verifies handling of expired sessions
   * @expects 401 status code after session expiry
   */
  it("should handle expired session", async () => {
    // Destroy session
    await testSession.post("/api/users/auth/logout");

    const res = await testSession.get("/api/profile").expect(401);

    expect(res.body).toEqual({
      authenticated: false,
    });
  });

  /**
   * Cleanup after each test:
   * 1. Removes all test profiles
   * 2. Removes all test users
   * 3. Restores any mocked functions
   */
  afterEach(async () => {
    await UserProfile.destroy({ where: {} });
    await User.destroy({ where: {} });
    jest.restoreAllMocks();
  });
});

/**
 * Global cleanup after all tests complete
 * Closes database connection to prevent hanging handles
 */
afterAll(async () => {
  await sequelize.close();
});
