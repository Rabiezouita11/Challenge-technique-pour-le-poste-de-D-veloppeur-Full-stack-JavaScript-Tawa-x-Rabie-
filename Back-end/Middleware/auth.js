// middleware/auth.js
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();
// User authentication middleware
const isAuthenticated = (req, res, next) => {
  passport.authenticate(process.env.SECRET_KEY, { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user; // Add the user object to the request
    next();
  })(req, res, next);
};

module.exports = { isAuthenticated };
