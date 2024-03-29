const mongoose = require('mongoose');
const { createMemoryDb, stopMemoryDb } = require('./mongoMemoryDb');

let mongooseInstance = null;

async function dbConnect() {
  if (!mongooseInstance) {
    try {
      const uri =
        process.env.NODE_ENV === 'production'
          ? process.env.DB_MONGO_URI
          : await createMemoryDb();
      const client = await mongoose.connect(uri, {});

      console.log('Connected to MongoDB server');
      mongooseInstance = client; // Set the singleton instance
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error; // Throw error if connection fails
    }
  }

  return mongooseInstance;
}

async function getDbInstance() {
  const instance = await dbConnect();

  return instance;
}

async function dbCleanup() {
  stopMemoryDb();
  await mongoose.disconnect();
  mongooseInstance = null;
}

module.exports = { dbConnect, getDbInstance, dbCleanup };
