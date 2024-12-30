const Joi = require('joi');

const createTeacherSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  classes: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  subjects: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  pupils: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  isClassLeader: Joi.boolean().default(false),
  classLeaderSince: Joi.date().allow(null),
});

const updateTeacherSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  classes: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  subjects: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  pupils: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  isClassLeader: Joi.boolean(),
  classLeaderSince: Joi.date().allow(null),
}).min(1);

module.exports = {
  createTeacherSchema,
  updateTeacherSchema,
};
