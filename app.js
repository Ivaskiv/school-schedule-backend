const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const authRouter = require('./api/routes');
const userRouter = require('./api/users/routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;
const CLIENT_URL = process.env.CLIENT_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!MONGODB_URL || !CLIENT_URL || !JWT_SECRET_KEY) {
  console.error('Missing required environment variables in .env file.');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log(`Database connection successful... Server is started on the port ${PORT}`);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

app.use(
  cors({
    origin: CLIENT_URL,
    methods: 'GET, POST, PUT, DELETE',
    // credentials: true,
  })
);
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});
