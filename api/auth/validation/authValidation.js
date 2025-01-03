const Joi = require('joi');

const createSchoolSchema = Joi.object({
  name: Joi.string().min(3).max(50).trim().required(),
  address: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  phone: Joi.string().optional(),

  adminName: Joi.string().required(),
  adminEmail: Joi.string().email().required(),
  adminPassword: Joi.string().min(6).required(),
});

const updateSchoolSchema = Joi.object({
  name: Joi.string().min(3).max(50).trim().optional(),
  address: Joi.string().optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .optional(),
  phone: Joi.string().pattern(/^\d+$/).when('$isPhoneProvided', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  adminName: Joi.string().optional(),
  adminEmail: Joi.string().email().optional(),
  adminPassword: Joi.string().min(6).optional(),
});

const registerSchoolSchema = Joi.object({
  schoolName: Joi.string().required(),
  schoolAddress: Joi.string().required(),
  schoolEmail: Joi.string().required(),
  adminName: Joi.string().required(),
  adminEmail: Joi.string().email().required(),
  adminPassword: Joi.string().min(6).required(),
});

module.exports = { createSchoolSchema, updateSchoolSchema, registerSchoolSchema };
