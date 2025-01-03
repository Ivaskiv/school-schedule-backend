const { School, Admin } = require('../models/authModels');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    const { schoolName, schoolAddress, schoolEmail, adminName, adminEmail, adminPassword } =
      req.body;

    if (
      !schoolName ||
      !schoolAddress ||
      !schoolEmail ||
      !adminName ||
      !adminEmail ||
      !adminPassword
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await checkAdminExists(adminEmail);

    const school = await School.create({
      name: schoolName,
      address: schoolAddress,
      email: schoolEmail,
    });

    const hashedPassword = await hashPassword(adminPassword);

    const admin = await Admin.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      school: school._id,
    });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET_KEY, {
      expiresIn: '10h',
    });

    res.status(201).json({
      message: 'School and main admin registered successfully',
      school,
      admin: { id: admin._id, name: admin.name, email: admin.email },
      token,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    const statusCode = error.message === 'Admin with this email already exists' ? 409 : 500;
    res.status(statusCode).json({ message: error.message || 'Internal server error' });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { adminEmail, adminPassword } = req.body;

    if (!adminEmail || !adminPassword) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isPasswordValid = await bcrypt.compare(adminPassword, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login successful',
      admin: { id: admin._id, name: admin.name, email: admin.email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerSchoolAndAdmin, loginAdmin };
