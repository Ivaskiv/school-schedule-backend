const express = require('express');
const { createDirector } = require('../controllers/userControllers');
const { verifyToken } = require('../../utils/verifyTokenMiddleware');

const userRouter = express.Router();

userRouter.post('/create-director', verifyToken, createDirector);

// userRoutes.post('/create-teacher', verifyToken, createTeacher);

// userRoutes.post('/create-pupil', verifyToken, createPupil);

module.exports = userRouter;
