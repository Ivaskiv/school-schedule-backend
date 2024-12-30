//authMiddleware.js
const jwt = require('jsonwebtoken');
const HttpError = require('../../utils/HttpError');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(HttpError(401, 'Unauthorized'));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return next(HttpError(401, 'Invalid token'));
  }
};

const roleMiddleware = roles => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(HttpError(403, 'Access forbidden'));
  }
  next();
};

module.exports = { authMiddleware, roleMiddleware };
