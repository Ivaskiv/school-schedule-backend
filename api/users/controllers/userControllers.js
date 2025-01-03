const bcrypt = require('bcrypt');
const { User } = require('../models/userModels');
const { School, Admin } = require('../../auth/models/authModels');

const hashPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const createDirector = async (req, res) => {
  try {
    const { schoolId, directorName, directorEmail, directorPassword } = req.body;

    if (!schoolId || !directorName || !directorEmail || !directorPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const hashedPassword = await hashPassword(directorPassword);

    const director = await Admin.create({
      name: directorName,
      email: directorEmail,
      password: hashedPassword,
      school: school._id,
      role: 'director',
    });

    const user = new User({
      name: directorName,
      email: directorEmail,
      password: hashedPassword,
      role: 'director',
      school: school._id,
    });

    await user.save();

    res.status(201).json({
      message: 'Director and user created successfully',
      director,
      user,
    });
  } catch (error) {
    console.error('Error creating director and user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { createDirector };
