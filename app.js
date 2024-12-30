const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const pupilsRouter = require('./src/pupils/routes/pupilRoutes');
const teachersRouter = require('./src/teachers/routes/teacherRoutes');
// const classesRouter = require('./src/routes/classesRouter');
// const subjectsRouter = require('./src/routes/subjectsRouter');
const authRouter = require('./src/auth/routes/authRoutes');
const HttpError = require('./src/utils/HttpError');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('The API is working!', {
    environment: process.env.NODE_ENV,
    apiName: process.env.API_NAME,
    mongodbUrl: process.env.MONGODB_URL,
    frontendUrl: process.env.FRONTEND_URL,
  });
});
// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log(`Database connection successful... Server is started on the port ${PORT}`);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
//!
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
//!
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((err, req, res, next) => {
  console.error('Error caught by error handler:', err);
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use('/api/auth', authRouter);
app.use('/api/pupils', pupilsRouter);
app.use('/api/teachers', teachersRouter);
// app.use('/api/classes', classesRouter);
// app.use('/api/subjects', subjectsRouter);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
