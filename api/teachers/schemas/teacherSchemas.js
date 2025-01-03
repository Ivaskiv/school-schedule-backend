const Joi = require('joi');

const createPupilSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  class: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  subjects: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  teachers: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  isClassLeader: Joi.boolean().default(false),
  classLeaderSince: Joi.date().allow(null),
});

const updatePupilSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  classes: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  subjects: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  teachers: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  isClassLeader: Joi.boolean(),
  classLeaderSince: Joi.date().allow(null),
}).min(1);

module.exports = {
  createPupilSchema,
  updatePupilSchema,
};
