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

const teachersRouter = express.Router();

teachersRouter.post('/register', registerTeacher);
teachersRouter.post('/login', loginTeacher);

teachersRouter.use(authMiddleware);

teachersRouter.get('/', getAllTeachers);
teachersRouter.get('/:id', getTeacher);
teachersRouter.delete('/:id', deleteTeacher);
teachersRouter.post('/', validateBody(createTeacherSchema), createTeacher);
teachersRouter.put('/:id', validateBody(updateTeacherSchema), updateTeacher);
teachersRouter.patch('/:id/leader', validateBody(updateTeacherSchema), updateTeacherLeaderStatus);

module.exports = teachersRouter;
