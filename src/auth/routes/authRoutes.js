// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerSchoolAndAdmin);

router.post('/login', authController.loginAdmin);

module.exports = router;
