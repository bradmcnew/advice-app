import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/index.js"; // Import the User model
import googleStrategy from "./google-strategy.js"; // Import the Google strategy

// Export the Passport configuration function
export default (passport) => {
  // Use LocalStrategy for username and password authentication
  passport.use(
    new LocalStrategy(
      { usernameField: "username" }, // Specify the field used for the username
      async (username, password, done) => {
        try {
          // Find the user by username
          const user = await User.findOne({ where: { username } });
          if (!user) {
            // If no user found, return an error
            return done(null, false, { message: "Incorrect username." });
          }

          // Validate the password
          const isPasswordValid = await user.validatePassword(password);
          if (!isPasswordValid) {
            // If password is invalid, return an error
            return done(null, false, {
              message: "Username or password is incorrect.",
            });
          }

          // If everything is valid, return the user
          return done(null, user);
        } catch (error) {
          // Handle any unexpected errors
          return done(error);
        }
      }
    )
  );

  // Call google strategy
  googleStrategy(passport);

  // Serialize user instance to store in session
  passport.serializeUser((user, done) => {
    done(null, user.id); // Store user ID in session
  });

  // Deserialize user from session to retrieve the full user object
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id); // Fetch user by ID
      done(null, user); // Return the user object
    } catch (error) {
      // Handle any unexpected errors during deserialization
      done(error);
    }
  });
};
