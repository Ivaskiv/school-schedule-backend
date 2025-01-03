const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['teacher', 'pupil'],
    default: 'pupil',
  },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
});

const User = mongoose.model('User', userSchema);
module.exports = { User };
