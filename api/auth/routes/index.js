// authRouter.js
const express = require('express');

const authRouter = express.Router();

const { registerSchoolAndAdmin, loginAdmin } = require('../controllers/authController');
const { validateBody } = require('../../utils/validateBody');
const { registerSchoolSchema } = require('../validation/authValidation');

authRouter.post('/register', validateBody(registerSchoolSchema), registerSchoolAndAdmin);

authRouter.post('/login', loginAdmin);

module.exports = authRouter;
