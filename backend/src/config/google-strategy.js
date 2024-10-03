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
          // Try to find the user by Google ID
          let user = await User.findOne({ where: { google_id: profile.id } });

          if (!user) {
            // If no user exists with that Google ID, try to find by email
            user = await User.findOne({
              where: { email: profile.emails[0].value },
            });

            if (!user) {
              // If no user exists with that email, create a new user
              user = await User.create({
                google_id: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
              });
              console.log("New user created from Google: ", user);
            } else {
              // If user exists but doesn't have a Google ID, update it
              if (!user.google_id) {
                user.google_id = profile.id;
                await user.save();
                console.log("User updated with google_id: ", user);
              }
            }
          }

          return done(null, user); // Successfully return the user
        } catch (error) {
          console.error("Error during Google authentication:", error);
          return done(error); // Handle any errors that occur
        }
      }
    )
  );
};
