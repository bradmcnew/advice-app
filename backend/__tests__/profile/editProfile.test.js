// __tests__/profile/editProfile.test.js
const request = require("supertest");
const session = require("supertest-session");
const bcrypt = require("bcrypt");
const app = require("../../src/app");
const { User, UserProfile, sequelize } = require("../../src/models/index.js");

/**
 * @description Test suite for profile editing functionality
 * Tests create, update, validation, and error scenarios
 */
describe("PUT /api/profile/edit", () => {
  let testSession;
  let testUser;

// __tests__/profile/editProfile.test.js

/**
 * @description Test suite for profile editing functionality
 * Tests create, update, validation, and error scenarios
 */
describe("PUT /api/profile/edit", () => {
    let testSession;
    let testUser;

  const validProfileData = {
    first_name: "Test",
    last_name: "User",
    bio: "Test bio",
    phone_number: "1234567890",
    location: "Test City",
    profile_picture: "https://example.com/pic.jpg",
    social_media_links: JSON.stringify({
      twitter: "https://twitter.com/test",
      linkedin: "https://linkedin.com/in/test",
    }),
  };

  beforeEach(async () => {
    // Create test user
    const hashedPassword = await bcrypt.hash("password123", 10);
    testUser = await User.create({
      username: "testuser",
      email: "test@example.com",
      password_hash: hashedPassword,
      role: "high_school",
    });

    // Setup authenticated session
    testSession = session(app);
        await testSession.post("/api/users/auth/login").send({
      username: "testuser",
      password: "password123",
  });

it("should create new profile successfully", async () => {
    const res = await testSession
        .put("/api/profile/edit")
        .send(validProfileData)
        .expect(201);

    expect(res.body).toEqual({
        message: "User profile created successfully",
        user_profile: expect.objectContaining({
            ...validProfileData,
            social_media_links: {
                twitter: "https://twitter.com/test",
                linkedin: "https://linkedin.com/in/test",
            },
        }),
    });

    // Verify database
        const profile = await UserProfile.findOne({
            where: { user_id: testUser.id },
        });
        expect(profile).toBeTruthy();
    });

    it("should update existing profile successfully", async () => {
        // First create profile
        await UserProfile.create({
            user_id: testUser.id,
            ...validProfileData,
            social_media_links: {
                twitter: "https://twitter.com/test",
                linkedin: "https://linkedin.com/in/test",
            },
        });

        // Update profile
        const updatedData = {
            ...validProfileData,
            bio: "Updated bio",
        };

        const res = await testSession
            .put("/api/profile/edit")
            .send(updatedData)
            .expect(200);

        expect(res.body).toEqual({
            message: "User profile updated successfully",
            user_profile: expect.objectContaining({
                ...updatedData,
                social_media_links: {
                    twitter: "https://twitter.com/test",
                    linkedin: "https://linkedin.com/in/test",
                },
            }),
        });
    });

    it("should handle additional college student fields", async () => {
        await testUser.update({ role: "college_student" });

        const collegeProfileData = {
            ...validProfileData,
            resume: "https://example.com/resume.pdf",
            skills: JSON.stringify(["JavaScript", "React"]),
            availability: "Available weekdays",
        };

        const res = await testSession
            .put("/api/profile/edit")
            .send(collegeProfileData)
            .expect(201);

        expect(res.body.user_profile).toMatchObject({
            resume: "https://example.com/resume.pdf",
            skills: ["JavaScript", "React"],
            availability: "Available weekdays",
        });
    });

    it("should validate bio length", async () => {
        const invalidData = {
            ...validProfileData,
            bio: "a".repeat(501),
        };

        const res = await testSession
            .put("/api/profile/edit")
            .send(invalidData)
            .expect(400);

        expect(res.body.errors).toContainEqual(
            expect.objectContaining({
                msg: "Bio must not exceed 500 characters",
            })
        );
    });

    it("should validate phone number format", async () => {
        const invalidData = {
            ...validProfileData,
            phone_number: "invalid-number",
        };

        const res = await testSession
            .put("/api/profile/edit")
            .send(invalidData)
            .expect(400);

        expect(res.body.errors).toContainEqual(
            expect.objectContaining({
                msg: "Invalid phone number format",
            })
        );
    });

    it("should validate social media links", async () => {
        const invalidData = {
            ...validProfileData,
            social_media_links: JSON.stringify({
                twitter: "invalid-url",
            }),
        };

        const res = await testSession
            .put("/api/profile/edit")
            .send(invalidData)
            .expect(400);

        expect(res.body.errors).toContainEqual(
            expect.objectContaining({
                msg: "Each social media link must be a valid URL",
            })
        );
    });

    it("should return 401 if not authenticated", async () => {
        const unauthenticatedSession = session(app);

        const res = await unauthenticatedSession
            .put("/api/profile/edit")
            .send(validProfileData)
            .expect(401);

        expect(res.body).toEqual({
            authenticated: false,
        });
    });

    it("should handle database errors", async () => {
        jest
            .spyOn(UserProfile, "findOrCreate")
            .mockRejectedValue(new Error("Database error"));

        const res = await testSession
            .put("/api/profile/edit")
            .send(validProfileData)
            .expect(500);

        expect(res.body).toEqual({
            message: "Internal Server Error",
        });
    });

    it("should validate first name presence", async () => {
        const invalidData = {
            ...validProfileData,
            first_name: "",
        };

        const res = await testSession
            .put("/api/profile/edit")
            .send(invalidData)
            .expect(400);

        expect(res.body.errors).toContainEqual(
            expect.objectContaining({
                msg: "First name is required",
            })
        );
    });

    it("should validate last name presence", async () => {
        const invalidData = {
            ...validProfileData,
            last_name: "",
        };

        const res = await testSession
            .put("/api/profile/edit")
            .send(invalidData)
            .expect(400);

        expect(res.body.errors).toContainEqual(
            expect.objectContaining({
                msg: "Last name is required",
            })
        );
    });

    it("should validate location presence", async () => {
        const invalidData = {
            ...validProfileData,
            location: "",
        };

        const res = await testSession
            .put("/api/profile/edit")
            .send(invalidData)
            .expect(400);

        expect(res.body.errors).toContainEqual(
            expect.objectContaining({
                msg: "Location is required",
            })
        );
    });

    it("should validate profile picture URL", async () => {
        const invalidData = {
            ...validProfileData,
            profile_picture: "invalid-url",
        };

        const res = await testSession
            .put("/api/profile/edit")
            .send(invalidData)
            .expect(400);

        expect(res.body.errors).toContainEqual(
            expect.objectContaining({
                msg: "Invalid URL for profile picture",
            })
        );
    });

    it("should validate skills format", async () => {
        const invalidData = {
            ...validProfileData,
            skills: "invalid-skills",
        };

        const res = await testSession
            .put("/api/profile/edit")
            .send(invalidData)
            .expect(400);

        expect(res.body.errors).toContainEqual(
            expect.objectContaining({
                msg: "Skills must be a valid array",
            })
        );
    });

    it("should validate availability length", async () => {
        const invalidData = {
            ...validProfileData,
            availability: "a".repeat(51),
        };

        const res = await testSession
            .put("/api/profile/edit")
            .send(invalidData)
            .expect(400);

        expect(res.body.errors).toContainEqual(
            expect.objectContaining({
                msg: "Availability must not exceed 50 characters",
            })
        );
    });

    afterEach(async () => {
        await UserProfile.destroy({ where: {} });
        await User.destroy({ where: {} });
        jest.restoreAllMocks();
    });

    afterAll(async () => {
        await sequelize.close();
    });
});
    const profile = await UserProfile.findOne({
        where: { user_id: testUser.id },
    });
    expect(profile).toBeTruthy();
});
    const res = await testSession
      .put("/api/profile/edit")
      .send(validProfileData)
      .expect(201);

    expect(res.body).toEqual({
      message: "User profile created successfully",
      user_profile: expect.objectContaining({
        ...validProfileData,
        social_media_links: {
          twitter: "https://twitter.com/test",
          linkedin: "https://linkedin.com/in/test",
        },
      }),
    });

    // Verify database
    const profile = await UserProfile.findOne({
      where: { user_id: testUser.id },
    });
    expect(profile).toBeTruthy();
  });

        it("should update existing profile successfully", async () => {
            // First create profile
            await UserProfile.create({
                user_id: testUser.id,
                ...validProfileData,
                social_media_links: {
                    twitter: "https://twitter.com/test",
                    linkedin: "https://linkedin.com/in/test",
                },
            });

            // Update profile
            const updatedData = {
                ...validProfileData,
                bio: "Updated bio",
            };

            const res = await testSession
                .put("/api/profile/edit")
                .send(updatedData)
                .expect(200);

            expect(res.body).toEqual({
                message: "User profile updated successfully",
                user_profile: expect.objectContaining({
                    ...updatedData,
                    social_media_links: {
                        twitter: "https://twitter.com/test",
                        linkedin: "https://linkedin.com/in/test",
                    },
                }),
            });
        });

        it("should handle additional college student fields", async () => {
            await testUser.update({ role: "college_student" });

            console.log("testUser", testUser);

            const collegeProfileData = {
                ...validProfileData,
                resume: "https://example.com/resume.pdf",
                skills: JSON.stringify(["JavaScript", "React"]),
                availability: "Available weekdays",
            };

            const res = await testSession
                .put("/api/profile/edit")
                .send(collegeProfileData)
                .expect(201);

            expect(res.body.user_profile).toMatchObject({
                resume: "https://example.com/resume.pdf",
                skills: ["JavaScript", "React"],
                availability: "Available weekdays",
            });
        });

        it("should validate bio length", async () => {
            const invalidData = {
                ...validProfileData,
                bio: "a".repeat(501),
            };

            const res = await testSession
                .put("/api/profile/edit")
                .send(invalidData)
                .expect(400);

            expect(res.body.errors).toContainEqual(
                expect.objectContaining({
                    msg: "Bio must not exceed 500 characters",
                })
            );
        });

        it("should validate phone number format", async () => {
            const invalidData = {
                ...validProfileData,
                phone_number: "invalid-number",
            };

            const res = await testSession
                .put("/api/profile/edit")
                .send(invalidData)
                .expect(400);

            expect(res.body.errors).toContainEqual(
                expect.objectContaining({
                    msg: "Invalid phone number format",
                })
            );
        });

        it("should validate social media links", async () => {
            const invalidData = {
                ...validProfileData,
                social_media_links: JSON.stringify({
                    twitter: "invalid-url",
                }),
            };

            const res = await testSession
                .put("/api/profile/edit")
                .send(invalidData)
                .expect(400);

            expect(res.body.errors).toContainEqual(
                expect.objectContaining({
                    msg: "Each social media link must be a valid URL",
                })
            );
        });

        it("should return 401 if not authenticated", async () => {
            const unauthenticatedSession = session(app);

            const res = await unauthenticatedSession
                .put("/api/profile/edit")
                .send(validProfileData)
                .expect(401);

            expect(res.body).toEqual({
                authenticated: false,
            });
        });

        it("should handle database errors", async () => {
            jest
                .spyOn(UserProfile, "findOrCreate")
                .mockRejectedValue(new Error("Database error"));

            const res = await testSession
                .put("/api/profile/edit")
                .send(validProfileData)
                .expect(500);

            expect(res.body).toEqual({
                message: "Internal Server Error",
            });
        });

        it("should validate first name presence", async () => {
            const invalidData = {
                ...validProfileData,
                first_name: "",
            };

            const res = await testSession
                .put("/api/profile/edit")
                .send(invalidData)
                .expect(400);

            expect(res.body.errors).toContainEqual(
                expect.objectContaining({
                    msg: "First name is required",
                })
            );
        });

        it("should validate last name presence", async () => {
            const invalidData = {
                ...validProfileData,
                last_name: "",
            };

            const res = await testSession
                .put("/api/profile/edit")
                .send(invalidData)
                .expect(400);

            expect(res.body.errors).toContainEqual(
                expect.objectContaining({
                    msg: "Last name is required",
                })
            );
        });

        it("should validate location presence", async () => {
            const invalidData = {
                ...validProfileData,
                location: "",
            };

            const res = await testSession
                .put("/api/profile/edit")
                .send(invalidData)
                .expect(400);

            expect(res.body.errors).toContainEqual(
                expect.objectContaining({
                    msg: "Location is required",
                })
            );
        });

        afterEach(async () => {
            await UserProfile.destroy({ where: {} });
            await User.destroy({ where: {} });
            jest.restoreAllMocks();
        });

        afterAll(async () => {
            await sequelize.close();
        });
    });
        it("should create new profile successfully", async () => {
    const res = await testSession
      .put("/api/profile/edit")
      .send(validProfileData)
      .expect(201);

    expect(res.body).toEqual({
      message: "User profile created successfully",
      user_profile: expect.objectContaining({
        ...validProfileData,
        social_media_links: {
          twitter: "https://twitter.com/test",
          linkedin: "https://linkedin.com/in/test",
        },
      }),
    });

    // Verify database
    const profile = await UserProfile.findOne({
      where: { user_id: testUser.id },
    });
    expect(profile).toBeTruthy();
  });

  it("should update existing profile successfully", async () => {
    // First create profile
    await UserProfile.create({
      user_id: testUser.id,
      ...validProfileData,
      social_media_links: {
        twitter: "https://twitter.com/test",
        linkedin: "https://linkedin.com/in/test",
      },
    });

    // Update profile
    const updatedData = {
      ...validProfileData,
      bio: "Updated bio",
    };

    const res = await testSession
      .put("/api/profile/edit")
      .send(updatedData)
      .expect(200);

    expect(res.body).toEqual({
      message: "User profile updated successfully",
      user_profile: expect.objectContaining({
        ...updatedData,
        social_media_links: {
          twitter: "https://twitter.com/test",
          linkedin: "https://linkedin.com/in/test",
        },
      }),
    });
  });

  it("should handle additional college student fields", async () => {
    await testUser.update({ role: "college_student" });

    console.log("testUser", testUser);

    const collegeProfileData = {
      ...validProfileData,
                resume: "https://example.com/resume.pdf",
                skills: JSON.stringify(["JavaScript", "React"]),
                availability: "Available weekdays",
            };

            const res = await testSession
                .put("/api/profile/edit")
                .send(collegeProfileData)
                .expect(201);

            expect(res.body.user_profile).toMatchObject({
                resume: "https://example.com/resume.pdf",
                skills: ["JavaScript", "React"],
                availability: "Available weekdays",
            });
        });

        it("should validate bio length", async () => {
            const invalidData = {
                ...validProfileData,
                bio: "a".repeat(501),
            };

            const res = await testSession
                .put("/api/profile/edit")
                .send(invalidData)
                .expect(400);

            expect(res.body.errors).toContainEqual(
                expect.objectContaining({
                    msg: "Bio must not exceed 500 characters",
                })
            );
        });

        it("should validate phone number format", async () => {
            const invalidData = {
                ...validProfileData,
                phone_number: "invalid-number",
            };

            const res = await testSession
                .put("/api/profile/edit")
                .send(invalidData)
                .expect(400);

            expect(res.body.errors).toContainEqual(
                expect.objectContaining({
                    msg: "Invalid phone number format",
                })
            );
        });

        it("should validate social media links", async () => {
            const invalidData = {
                ...validProfileData,
                social_media_links: JSON.stringify({
                    twitter: "invalid-url",
                }),
            };

            const res = await testSession
                .put("/api/profile/edit")
                .send(invalidData)
                .expect(400);

            expect(res.body.errors).toContainEqual(
                expect.objectContaining({
                    msg: "Each social media link must be a valid URL",
                })
            );
        });

        it("should return 401 if not authenticated", async () => {
            const unauthenticatedSession = session(app);

            const res = await unauthenticatedSession
                .put("/api/profile/edit")
                .send(validProfileData)
                .expect(401);

            expect(res.body).toEqual({
                authenticated: false,
            });
        });

        it("should handle database errors", async () => {
            jest
                .spyOn(UserProfile, "findOrCreate")
                .mockRejectedValue(new Error("Database error"));

            const res = await testSession
                .put("/api/profile/edit")
                .send(validProfileData)
                .expect(500);

            expect(res.body).toEqual({
                message: "Internal Server Error",
            });
        });

        it("should validate first name presence", async () => {
            const invalidData = {
                ...validProfileData,
                first_name: "",
            };

            const res = await testSession
                .put("/api/profile/edit")
                .send(invalidData)
                .expect(400);

            expect(res.body.errors).toContainEqual(
                expect.objectContaining({
                    msg: "First name is required",
                })
            );
        });

        it("should validate last name presence", async () => {
            const invalidData = {
                ...validProfileData,
                last_name: "",
            };

            const res = await testSession
                .put("/api/profile/edit")
                .send(invalidData)
                .expect(400);

            expect(res.body.errors).toContainEqual(
                expect.objectContaining({
                    msg: "Last name is required",
                })
            );
        });

        it("should validate location presence", async () => {
            const invalidData = {
                ...validProfileData,
                location: "",
            };

            const res = await testSession
                .put("/api/profile/edit")
                .send(invalidData)
                .expect(400);

            expect(res.body.errors).toContainEqual(
                expect.objectContaining({
                    msg: "Location is required",
                })
            );
        });

        afterEach(async () => {
            await UserProfile.destroy({ where: {} });
            await User.destroy({ where: {} });
            jest.restoreAllMocks();
        });

        afterAll(async () => {
            await sequelize.close();
        });
    });...validProfileData,
      resume: "https://example.com/resume.pdf",
      skills: JSON.stringify(["JavaScript", "React"]),
      availability: "Available weekdays",
    };

    const res = await testSession
      .put("/api/profile/edit")
      .send(collegeProfileData)
      .expect(201);

    expect(res.body.user_profile).toMatchObject({
      resume: "https://example.com/resume.pdf",
      skills: ["JavaScript", "React"],
      availability: "Available weekdays",
    });
  });

  it("should validate bio length", async () => {
    const invalidData = {
      ...validProfileData,
      bio: "a".repeat(501),
    };

    const res = await testSession
      .put("/api/profile/edit")
      .send(invalidData)
      .expect(400);

    expect(res.body.errors).toContainEqual(
      expect.objectContaining({
        msg: "Bio must not exceed 500 characters",
      })
    );
  });

  it("should validate phone number format", async () => {
    const invalidData = {
      ...validProfileData,
      phone_number: "invalid-number",
    };

    const res = await testSession
      .put("/api/profile/edit")
      .send(invalidData)
      .expect(400);

    expect(res.body.errors).toContainEqual(
      expect.objectContaining({
        msg: "Invalid phone number format",
      })
    );
  });

  it("should validate social media links", async () => {
    const invalidData = {
      ...validProfileData,
      social_media_links: JSON.stringify({
        twitter: "invalid-url",
      }),
    };

    const res = await testSession
      .put("/api/profile/edit")
      .send(invalidData)
      .expect(400);

    expect(res.body.errors).toContainEqual(
      expect.objectContaining({
        msg: "Each social media link must be a valid URL",
      })
    );
  });

  it("should return 401 if not authenticated", async () => {
    const unauthenticatedSession = session(app);

    const res = await unauthenticatedSession
      .put("/api/profile/edit")
      .send(validProfileData)
      .expect(401);

    expect(res.body).toEqual({
      authenticated: false,
    });
  });

  it("should handle database errors", async () => {
    jest
      .spyOn(UserProfile, "findOrCreate")
      .mockRejectedValue(new Error("Database error"));

    const res = await testSession
      .put("/api/profile/edit")
      .send(validProfileData)
      .expect(500);

    expect(res.body).toEqual({
      message: "Internal Server Error",
    });
  });

  afterEach(async () => {
    await UserProfile.destroy({ where: {} });
    await User.destroy({ where: {} });
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
