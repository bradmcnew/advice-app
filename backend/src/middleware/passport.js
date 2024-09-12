const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../config/db");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const res = await pool.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
      const user = res.rows[0];

      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      if (password !== user.password) {
        return done(null, false, { message: "Password incorrect" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = res.rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});
