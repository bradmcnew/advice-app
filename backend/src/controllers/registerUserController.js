const { registerUser } = require("../services/userRegisterService");

const registerUserController = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);

    if (!result.success) {
      return res
        .status(result.statusCode || 400)
        .json({ message: result.message });
    }

    res
      .status(result.statusCode || 201)
      .json({ message: "User registered successfully", user: result.user });
  } catch (error) {
    console.error("Error during user registration:", error);
    next(error);
  }
};

module.exports = registerUserController;
