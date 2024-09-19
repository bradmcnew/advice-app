// config/passport.js
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../models");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "username" },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ where: { username } });
          if (!user) {
            return done(null, false, { message: "Incorrect username." });
          }

          const isPasswordValid = await user.validatePassword(password);
          if (!isPasswordValid) {
            return done(null, false, { message: "Incorrect password." });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
