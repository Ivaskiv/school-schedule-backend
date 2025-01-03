const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const pupilSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  role: { type: String, default: 'pupil' },
  createdAt: { type: Date, default: Date.now },
});

pupilSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Pupil = mongoose.model('Pupil', pupilSchema);
module.exports = Pupil;
