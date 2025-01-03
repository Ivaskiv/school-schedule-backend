const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false },
  mainAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
});

const School = mongoose.model('School', schoolSchema);

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['mainAdmin', 'admin', 'director', 'deputy', 'teacher', 'pupil'],
    required: true,
  },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = { School, Admin };
