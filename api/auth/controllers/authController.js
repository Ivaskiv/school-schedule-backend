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
  const { schoolName, schoolAddress, schoolEmail, adminName, adminEmail, adminPassword } = req.body;

  try {
    await checkAdminExists(adminEmail);

    const newSchool = new School({
      name: schoolName,
      address: schoolAddress,
      email: schoolEmail,
    });
    await newSchool.save();

    const hashedPassword = await hashPassword(adminPassword);
    const newAdmin = new Admin({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: req.body.adminRole || 'mainAdmin',
      school: newSchool._id,
    });

    await newAdmin.save();

    newSchool.mainAdmin = newAdmin._id;
    await newSchool.save();

    res.status(201).json({
      message: 'School and Admin registered successfully!',
      school: newSchool,
      admin: newAdmin,
    });
  } catch (error) {
    console.error('Error registering school and admin:', error);
    res.status(500).json({ error: error.message });
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
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerSchoolAndAdmin, loginAdmin };
