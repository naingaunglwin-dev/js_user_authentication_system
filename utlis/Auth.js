const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

async function authenticate(req, resAdapter) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    resAdapter.status(401).json({
      error: 'No token provided',
    });

    return null;
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    resAdapter.status(401).json({
      error: 'Invalid token'
    });

    return null;
  }

  let decoded;

  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch (err) {
    resAdapter.status(401).json({
      error: err.message,
    });

    return null;
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    resAdapter.status(400).json({
      error: 'User not found'
    });

    return null;
  }

  return user;
}

module.exports = authenticate;
