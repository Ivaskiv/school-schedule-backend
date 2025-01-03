const Pupil = require('../models/pupilModel');
const School = require('../../auth/models/authModels/schoolModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../../../utils/HttpError');
const { errorWrapper } = require('../../../utils/errorWrapper');

// Реєстрація учня
const registerPupil = errorWrapper(async (req, res, next) => {
  const { name, email, password, schoolId, classId } = req.body;

  // Перевірка, чи вже існує учень з таким email
  const existingPupil = await Pupil.findOne({ email });
  if (existingPupil) {
    throw new HttpError(400, 'Pupil with this email already exists');
  }

  // Перевірка, чи існує школа
  const school = await School.findById(schoolId);
  if (!school) {
    throw new HttpError(404, 'School not found');
  }

  // Хешування пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створення нового учня
  const pupil = new Pupil({
    name,
    email,
    password: hashedPassword,
    school: schoolId,
    class: classId,
  });

  // Збереження учня
  await pupil.save();

  // Додавання учня до школи
  school.pupils.push(pupil._id);
  await school.save();

  res.status(201).json({
    message: 'Pupil registered successfully',
    pupil: {
      id: pupil._id,
      name: pupil.name,
      email: pupil.email,
      school: pupil.school,
      class: pupil.class,
    },
  });
});

// Логін учня
const loginPupil = errorWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  // Перевірка, чи існує учень
  const pupil = await Pupil.findOne({ email });
  if (!pupil) {
    throw new HttpError(401, 'Invalid credentials');
  }

  // Перевірка пароля
  const isPasswordValid = await bcrypt.compare(password, pupil.password);
  if (!isPasswordValid) {
    throw new HttpError(401, 'Invalid credentials');
  }

  // Генерація токену
  const token = jwt.sign(
    { userId: pupil._id, role: 'pupil', schoolId: pupil.school },
    process.env.SECRET_KEY,
    { expiresIn: '5h' }
  );

  res.status(200).json({
    message: 'Logged in successfully',
    token,
    user: {
      id: pupil._id,
      email: pupil.email,
      role: 'pupil',
      school: pupil.school,
    },
  });
});

// Отримання всіх учнів
const getAllPupils = errorWrapper(async (req, res, next) => {
  const pupils = await Pupil.find().populate('school class');
  res.status(200).json(pupils);
});

// Отримання учня за ID
const getPupil = async (req, res, next) => {
  const { id } = req.params;

  try {
    const pupil = await Pupil.findById(id).populate('school class');
    if (!pupil) {
      return res.status(404).json({ message: 'Pupil not found' });
    }
    res.status(200).json(pupil);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Оновлення статусу класного керівника для учня
const updatePupilLeaderStatus = async (req, res, next) => {
  const { id } = req.params;
  const { isClassLeader, classLeaderSince } = req.body;

  try {
    const updatedPupil = await Pupil.findByIdAndUpdate(
      id,
      { isClassLeader, classLeaderSince },
      { new: true, runValidators: true }
    );
    if (!updatedPupil) {
      return res.status(404).json({ message: 'Pupil not found' });
    }
    res.status(200).json(updatedPupil);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Видалення учня
const deletePupil = async (req, res) => {
  const { id } = req.params;
  try {
    const pupil = await Pupil.findByIdAndDelete(id);
    if (!pupil) {
      return res.status(404).json({ message: 'Pupil not found' });
    }
    res.status(200).json({ message: 'Pupil deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Створення учня
const createPupil = async (req, res) => {
  try {
    const newPupil = await Pupil.create(req.body);
    res.status(201).json(newPupil);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Оновлення інформації про учня
const updatePupil = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedPupil = await Pupil.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedPupil) {
      return res.status(404).json({ message: 'Pupil not found' });
    }
    res.status(200).json(updatedPupil);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  registerPupil,
  loginPupil,
  getAllPupils,
  getPupil,
  updatePupilLeaderStatus,
  deletePupil,
  createPupil,
  updatePupil,
};
