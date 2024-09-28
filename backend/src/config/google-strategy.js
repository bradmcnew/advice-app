const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find or create user based on Google profile
          const [user, created] = await User.findOrCreate({
            where: { googleId: profile.id },
            defaults: {
              username: profile.displayName,
              email: profile.emails[0].value,
            },
          });

          // If the user was created, log the creation status
          if (created) {
            console.log("User created from google: ", user);
          }

          return done(null, user); // Return the user regardless of creation status
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
