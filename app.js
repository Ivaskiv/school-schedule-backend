const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
// const pupilRoutes = require('./api/pupils/routes/pupilRoutes');
// const teacherRoutes = require('./api/teachers/routes/teacherRoutes');
// const classesRouter = require('./src/routes/classesRouter');
// const subjectsRouter = require('./src/routes/subjectsRouter');
const authRouter = require('./api/auth/routes/authRouter');
const userRoutes = require('./api/auth/routes/userRoutes');
const HttpError = require('./api/utils/HttpError');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// });
// app.use(express.json());
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// app.get('/', (req, res) => {
//   res.send('The API is working!', {
//     environment: process.env.NODE_ENV,
//     apiName: process.env.API_NAME,
//     mongodbUrl: process.env.MONGODB_URL,
//     frontendUrl: process.env.FRONTEND_URL,
//   });
// });

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

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//!
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection at:', promise, 'reason:', reason);
//   process.exit(1);
// });
//!

// app.use((err, req, res, next) => {
//   console.error('Error caught by error handler:', err);
//   if (err instanceof HttpError) {
//     res.status(err.statusCode).json({ message: err.message });
//   } else {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api', userRoutes);

// app.use('/pupils', pupilRoutes);
// app.use('/teachers', teacherRoutes);
// app.use('/classes', classesRouter);
// app.use('/subjects', subjectsRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});
