const { loginUser } = require("../services/userLoginService");

const loginUserController = async (req, res, next) => {
  try {
    const result = await loginUser(req, res, next);

    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }

    res
      .status(200)
      .json({ message: "Logged in successfully", user: result.user });
  } catch (error) {
    console.error("Error during user login:", error);
    next(error);
  }
};

module.exports = loginUserController;
