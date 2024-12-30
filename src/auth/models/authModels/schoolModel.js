const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  address: { type: String, required: true },
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  ],
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
  ],
  pupils: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pupil',
    },
  ],
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
  ],
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
  ],
});

const School = mongoose.model('School', schoolSchema);

module.exports = School;
