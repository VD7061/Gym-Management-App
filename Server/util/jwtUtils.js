const jwt = require('jsonwebtoken');
const User = require('../Models/user.js');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );
};

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization");
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.user = { id: user._id };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
