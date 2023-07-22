const validateUserRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = {};
  // Check if all required fields are present
  if (!username) {
    errors.username = "Username is required.";
  }

  // Check if the email is missing
  if (!email) {
    errors.email = "Email is required.";
  }

  // Check if the password is missing
  if (!password) {
    errors.password = "Password is required.";
  }

  // If there are any errors, send the response with the error messages
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  // Validate email format using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  // Validate password strength (e.g., minimum 8 characters with at least one uppercase letter, one lowercase letter, and one digit)
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit." });
  }

  next();
};

module.exports = { validateUserRegistration };
