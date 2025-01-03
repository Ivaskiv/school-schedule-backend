//errorWrapper.js
const messageList = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
};

const errorWrapper = fn => {
  const ew = async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const statusCode = error.status || 500;
      const errorMessage = error.message || messageList[statusCode] || 'Internal Server Error';
      res.status(statusCode).json({ message: errorMessage });
    }
  };

  return ew;
};

const handleNotFound = (_, res) => {
  res.status(404).json({ message: 'Route not found' });
};

const handleServerError = (err, _, res, __) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
};

module.exports = { errorWrapper, handleNotFound, handleServerError };
