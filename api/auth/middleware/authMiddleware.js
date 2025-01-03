const { School, Admin } = require('../models/authModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Функція для хешування пароля
const hashPassword = async password => {
  const salt = await bcrypt.genSalt(10); // Створення солі
  return bcrypt.hash(password, salt); // Хешування пароля з цією солею
};

// Функція для перевірки наявності адміністратора за email
const checkAdminExists = async email => {
  const admin = await Admin.findOne({ email });
  if (admin) {
    throw new Error('Admin with this email already exists');
  }
};

// Реєстрація школи та адміністратора
const registerSchoolAndAdmin = async (req, res) => {
  try {
    const { schoolName, schoolAddress, adminName, adminEmail, adminPassword } = req.body;

    // Перевірка заповнення всіх полів
    if (!schoolName || !schoolAddress || !adminName || !adminEmail || !adminPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Перевірка наявності адміністратора з таким email
    await checkAdminExists(adminEmail);

    // Створення школи
    const school = await School.create({ name: schoolName, address: schoolAddress });

    // Хешування пароля
    const hashedPassword = await hashPassword(adminPassword);

    // Створення адміністратора
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

// Вхід адміністратора
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Перевірка заповнення всіх полів
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Пошук адміністратора
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Перевірка пароля
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Генерація JWT
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Очікуємо токен в заголовку авторизації

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.adminId = decoded.id; // Додаємо ID адміністратора до запиту
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
module.exports = { registerSchoolAndAdmin, loginAdmin, verifyToken };
