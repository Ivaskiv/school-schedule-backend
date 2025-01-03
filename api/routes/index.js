// authRouter.js
const express = require('express');

const authRouter = express.Router();

const { registerSchoolAndAdmin, loginAdmin } = require('../auth/controllers/authController');
const { validateBody } = require('../utils/validateBody');
const { registerSchoolSchema } = require('../auth/validation/authValidation');
const { Admin, School } = require('../auth/models/authModels');

authRouter.post('/register', validateBody(registerSchoolSchema), registerSchoolAndAdmin);

authRouter.post('/login', loginAdmin);

authRouter.get('/school/:id', async (req, res) => {
  try {
    const school = await School.findById(req.params.id).populate('mainAdmin');
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.json(school);
  } catch (error) {
    console.error('Error fetching school:', error);
    res.status(500).json({ message: 'Error fetching school data', error: error.message });
  }
});

authRouter.get('/admin/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).populate('school');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ message: 'Error fetching admin data', error: error.message });
  }
});

module.exports = authRouter;
