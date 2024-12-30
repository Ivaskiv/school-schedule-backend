const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const School = require('../models/authModels/schoolModel');
const Admin = require('../models/authModels/adminModel');
const HttpError = require('../../utils/HttpError');
const User = require('../models/userModel');

const registerSchoolAndAdmin = async (req, res, next) => {
  const { schoolName, schoolAddress, adminName, adminEmail, adminPassword } = req.body;

  try {
    const existingSchool = await School.findOne({ name: schoolName });
    if (existingSchool) {
      return next(HttpError(400, 'School already exists'));
    }

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      return next(HttpError(400, 'Administrator with this email already exists.'));
    }

    const school = new School({
      name: schoolName,
      address: schoolAddress,
    });

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = new Admin({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      school: school._id,
      role: 'admin',
    });

    await admin.save();

    school.admins.push(admin._id);
    await school.save();

    const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'School and main admin registered successfully',
      token,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return next(HttpError(500, 'School registration failed'));
  }
};

const loginAdmin = async (req, res, next) => {
  const { adminEmail, adminPassword } = req.body;

  try {
    console.log('Received adminEmail:', adminEmail);
    const admin = await Admin.findOne({ email: adminEmail }).populate('school', 'name');

    if (!admin) {
      console.log('Admin not found with email:', adminEmail);
      return next(new HttpError(401, 'Invalid credentials'));
    }

    console.log('Stored hash:', admin.password);
    console.log('Entered password:', adminPassword);

    const isPasswordValid = await bcrypt.compare(adminPassword, admin.password);
    if (!isPasswordValid) {
      console.log('Invalid password for email:', adminEmail);
      return next(new HttpError(401, 'Invalid credentials'));
    }

    const token = jwt.sign(
      { userId: admin._id, role: admin.role, schoolId: admin.school },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Logged in successfully',
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return next(new HttpError(500, 'Login failed'));
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('school', 'name');

    if (!user) {
      return next(HttpError(401, 'Invalid credentials'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(HttpError(401, 'Invalid credentials'));
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, schoolId: user.school._id },
      process.env.SECRET_KEY,
      { expiresIn: '5h' }
    );

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: { id: user._id, email: user.email, role: user.role, school: user.school.name },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return next(HttpError(500, 'Login failed'));
  }
};

module.exports = { registerSchoolAndAdmin, loginAdmin, loginUser };
