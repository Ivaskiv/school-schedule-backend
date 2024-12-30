//validateBody.js
const validateBody = schema => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    console.error('Validation error:', error.details);
    return res.status(400).json({ errors: error.details.map(err => err.message) });
  }

  next();
};

module.exports = { validateBody };
