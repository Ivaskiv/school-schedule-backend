const Joi = require('joi');

const registerSchoolSchema = Joi.object({
  schoolName: Joi.string().required(),
  schoolAddress: Joi.string().required(),
  adminName: Joi.string().required(),
  adminEmail: Joi.string().email().required(),
  adminPassword: Joi.string().min(6).required(),
});

module.exports = { registerSchoolSchema };
