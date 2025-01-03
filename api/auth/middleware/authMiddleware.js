const { School, Admin } = require('../models/authModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const hashPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const checkAdminExists = async email => {
  const admin = await Admin.findOne({ email });
  if (admin) {
    throw new Error('Admin with this email already exists');
  }
};

const registerSchoolAndAdmin = async (req, res) => {
  try {
    const { schoolName, schoolAddress, adminName, adminEmail, adminPassword } = req.body;

    if (!schoolName || !schoolAddress || !adminName || !adminEmail || !adminPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await checkAdminExists(adminEmail);

    const school = await School.create({ name: schoolName, address: schoolAddress });

    const hashedPassword = await hashPassword(adminPassword);

    const admin = await Admin.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      school: school._id,
    });

    res.status(201).json({
      message: 'School and admin registered successfully',
      school,
      admin,
    });
  } catch (error) {
    console.error(error);
    if (error.message === 'Admin with this email already exists') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerSchoolAndAdmin, loginAdmin };
