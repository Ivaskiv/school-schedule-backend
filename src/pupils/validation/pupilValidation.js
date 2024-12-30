const Joi = require('joi');

const registerPupilSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  schoolId: Joi.string().required(),
  classId: Joi.string().optional(),
});

module.exports = { registerPupilSchema };
