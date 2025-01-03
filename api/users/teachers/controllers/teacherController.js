const Teacher = require('../models/teacherModel');
const School = require('../../auth/models/authModels/schoolModel');
const HttpError = require('../../../utils/HttpError');
const { errorWrapper } = require('../../../utils/errorWrapper');

const registerTeacher = async (req, res, next) => {
  const { name, email, password, school } = req.body;

  try {
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return next(new HttpError(400, 'Teacher with this email already exists'));
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      school,
    });

    await newTeacher.save();
    res.status(201).json({
      message: 'Teacher registered successfully',
      teacher: {
        id: newTeacher._id,
        name: newTeacher.name,
        email: newTeacher.email,
        school: newTeacher.school,
      },
    });
  } catch (error) {
    console.error(error);
    next(new HttpError(500, 'Registration failed'));
  }
};
const loginTeacher = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const teacher = await Teacher.findOf({ email });
    if (!teacher) {
      return next(new HttpError(401, 'Invalid credentials'));
    }
    const isPasswordValid = await bcrypt.compare(password, teacher.password);

    if (!isPasswordValid) {
      return next(new HttpError(401, 'Invalid credentials'));
    }

    const token = jwt.sign(
      { userId: teacher._id, role: 'teacher', schoolId: teacher.school },
      process.env.SECRET_KEY,
      { expiresIn: '5h' }
    );

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: { id: teacher._id, email: teacher.email, role: 'teacher', school: teacher.school },
    });
  } catch (error) {
    console.error('Error during teacher login:', error);
    return next(new HttpError(500, 'Login failed'));
  }
};
const getAllTeachers = errorWrapper(async (req, res, next) => {
  const teachers = await teachersService.listTeachers();
  res.status(200).json(teachers);
});

const getTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id).populate('classes subjects pupils');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const createTeacher = async (req, res) => {
  try {
    const newTeacher = await Teacher.create(req.body);
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateTeacherLeaderStatus = async (req, res) => {
  const { id } = req.params;
  const { isClassLeader, classLeaderSince } = req.body;
  try {
    const updatedTeacher = await Pupil.findByIdAndUpdate(
      id,
      { isClassLeader, classLeaderSince },
      { new: true, runValidators: true }
    );
    if (!updateTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  registerTeacher,
  loginTeacher,
  getAllTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  updateTeacherLeaderStatus,
};
