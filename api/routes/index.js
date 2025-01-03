// authRouter.js
const express = require('express');

const authRouter = express.Router();

const { registerSchoolAndAdmin, loginAdmin } = require('../auth/controllers/authController');
const { validateBody } = require('../utils/validateBody');
const { registerSchoolSchema } = require('../auth/validation/authValidation');

authRouter.post('/register', validateBody(registerSchoolSchema), registerSchoolAndAdmin);

authRouter.post('/login', loginAdmin);

module.exports = authRouter;
