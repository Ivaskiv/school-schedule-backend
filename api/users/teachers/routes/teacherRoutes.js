const express = require('express');
const {
  registerTeacher,
  loginTeacher,
  getAllTeachers,
  getTeacher,
  deleteTeacher,
  updateTeacherLeaderStatus,
  createTeacher,
  updateTeacher,
} = require('../controllers/teacherController');
const { authMiddleware } = require('../../auth/middleware/authMiddleware');
const { createTeacherSchema, updateTeacherSchema } = require('../schemas/teacherSchemas');
const { validateBody } = require('../../utils/validateBody');

const teacherRoutes = express.Router();

teacherRoutes.post('/register', registerTeacher);
teacherRoutes.post('/login', loginTeacher);

teacherRoutes.use(authMiddleware);

teacherRoutes.get('/', getAllTeachers);
teacherRoutes.get('/:id', getTeacher);
teacherRoutes.delete('/:id', deleteTeacher);
teacherRoutes.post('/', validateBody(createTeacherSchema), createTeacher);
teacherRoutes.put('/:id', validateBody(updateTeacherSchema), updateTeacher);
teacherRoutes.patch('/:id/leader', validateBody(updateTeacherSchema), updateTeacherLeaderStatus);

module.exports = teacherRoutes;
