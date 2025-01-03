const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { createDirector } = require('../controllers/userControllers');

const userRoutes = express.Router();

userRoutes.post('/create-director', verifyToken, createDirector);

// userRoutes.post('/create-teacher', verifyToken, createTeacher);

// userRoutes.post('/create-pupil', verifyToken, createPupil);

module.exports = userRoutes;
