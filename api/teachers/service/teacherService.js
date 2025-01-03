//teacherService.js
const mongoose = require('mongoose');
const Teacher = require('../models/teacherModel.js');
const { updateTeacherSchema, createTeacherSchema } = require('../schemas/teacherSchemas.js');
const { validateBody } = require('../../utils/validateBody');

async function listTeachers() {
  try {
    const teachers = await Teacher.find({});
    console.log('Teachers retrieved successfully');
    return teachers;
  } catch (error) {
    console.error('Error retrieving teachers:', error);
    throw error;
  }
}

async function getTeacherById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid teacher ID');
  }
  const teacher = await Teacher.findById(id);

  if (!teacher) {
    throw new Error('Not found');
  }

  return teacher;
}

async function removeTeacher(teacherId) {
  const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);
  if (!deletedTeacher) {
    return { code: 404, message: 'Not found' };
  }
  return { code: 200, message: 'Teacher deleted successfully', teacher: deletedTeacher };
}

async function addTeacher(teacherData) {
  if (Object.keys(teacherData).length === 0) {
    throw new Error('Body must have at least one field');
  }
  validateBody(teacherData, createTeacherSchema);
  const newTeacher = new Teacher(teacherData);
  await newTeacher.save();
  return newTeacher;
}

async function updateTeacherById(id, updateData) {
  if (Object.keys(updateData).length === 0) {
    throw new Error('Body must have at least one field');
  }
  validateBody(updateData, updateTeacherSchema);
  const teacher = await Teacher.findById(id);
  if (!teacher) {
    throw new Error('Not found');
  }
  const updatedTeacher = await Teacher.findByIdAndUpdate(id, updateData, { new: true });
  return updatedTeacher;
}

module.exports = {
  listTeachers,
  getTeacherById,
  removeTeacher,
  addTeacher,
  updateTeacherById,
};
