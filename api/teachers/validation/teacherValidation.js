const Joi = require('joi');

const registerTeacherSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  schoolId: Joi.string().required(),
});

module.exports = { registerTeacherSchema };
