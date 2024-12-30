const express = require('express');
const { registerPupil, loginPupil } = require('../controllers/pupilController');
const { authMiddleware, roleMiddleware } = require('../../auth/middleware/authMiddleware');

const router = express.Router();

router.post('/register', authMiddleware, roleMiddleware(['admin']), registerPupil);
router.post('/login', loginPupil);

module.exports = router;
