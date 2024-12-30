const Pupil = require('../models/pupilModel');
const School = require('../../auth/models/authModels/schoolModel');
const HttpError = require('../../utils/HttpError');

const registerPupil = async (req, res, next) => {
  const { name, email, password, schoolId, classId } = req.body;

  try {
    const existingPupil = await Pupil.findOne({ email });
    if (existingPupil) {
      return next(new HttpError(400, 'Pupil with this email already exists'));
    }

    const school = await School.findById(schoolId);
    if (!school) {
      return next(new HttpError(404, 'School not found'));
    }

    const pupil = new Pupil({ name, email, password, school: schoolId, class: classId });
    await pupil.save();

    school.pupils.push(pupil._id);
    await school.save();

    res.status(201).json({ message: 'Pupil registered successfully', pupil });
  } catch (error) {
    console.error(error);
    next(new HttpError(500, 'Registration failed'));
  }
};
const loginPupil = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const pupil = await Pupil.findOne({ email });

    if (!pupil) {
      return next(new HttpError(401, 'Invalid credentials'));
    }

    const isPasswordValid = await bcrypt.compare(password, pupil.password);

    if (!isPasswordValid) {
      return next(new HttpError(401, 'Invalid credentials'));
    }

    const token = jwt.sign(
      { userId: pupil._id, role: 'pupil', schoolId: pupil.school },
      process.env.SECRET_KEY,
      { expiresIn: '5h' }
    );

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: { id: pupil._id, email: pupil.email, role: 'pupil', school: pupil.school },
    });
  } catch (error) {
    console.error('Error during pupil login:', error);
    return next(new HttpError(500, 'Login failed'));
  }
};
module.exports = { registerPupil, loginPupil };
