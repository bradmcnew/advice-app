const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware or route handler
  }
  // User is not authenticated, respond with an error or redirect
  return res.status(401).json({ authenticated: false });
};

module.exports = ensureAuthenticated;
