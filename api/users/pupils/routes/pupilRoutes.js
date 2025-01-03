const express = require('express');
const {
  registerPupil,
  loginPupil,
  getAllPupils,
  getPupil,
  deletePupil,
  updatePupilLeaderStatus,
  createPupil,
  updatePupil,
} = require('../controllers/pupilController');
const { authMiddleware } = require('../../../auth/middleware/authMiddleware');
const { validateBody } = require('../../../utils/validateBody');
const { createPupilSchema, updatePupilSchema } = require('../../teachers/schemas/teacherSchemas');

const pupilRoutes = express.Router();

pupilRoutes.post('/register', registerPupil);
pupilRoutes.post('/login', loginPupil);

pupilRoutes.use(authMiddleware);

pupilRoutes.get('/', getAllPupils);
pupilRoutes.get('/:id', getPupil);
pupilRoutes.delete('/:id', deletePupil);
pupilRoutes.post('/', validateBody(createPupilSchema), createPupil);
pupilRoutes.put('/:id', validateBody(updatePupilSchema), updatePupil);
pupilRoutes.patch('/:id/leader', validateBody(updatePupilSchema), updatePupilLeaderStatus);

module.exports = pupilRoutes;
