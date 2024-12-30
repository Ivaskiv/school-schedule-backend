//db.js
const mongoose = require('mongoose');

async function connectDB() {
  try {
    const uriDb = process.env.MONGODB_URL;
    if (!uriDb) throw Error('MongoDB URI is not defined');

    await mongoose.connect(uriDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('The connection to MongoDB is successful');
  } catch (error) {
    console.error('Error connecting to MongoDB', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
