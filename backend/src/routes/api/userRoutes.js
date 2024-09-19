const express = require("express");
const router = express.Router();
const {
  userValidationRules,
  validateUser,
} = require("../../middleware/validators/userRegisterValidator");
const registerUserController = require("../../controllers/registerUserController");
const {
  loginValidationRules,
  validate,
} = require("../../middleware/validators/userLoginValidator");
const loginUserController = require("../../controllers/loginUserController");

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post(
  "/register",
  userValidationRules(),
  validateUser,
  registerUserController
);

router.post(
  "/auth/login",
  loginValidationRules(),
  validate,
  loginUserController
);

module.exports = router;
