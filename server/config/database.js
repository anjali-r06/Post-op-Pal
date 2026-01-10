// Database Configuration
// Supports both MongoDB and PostgreSQL

const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

const DB_TYPE = process.env.DB_TYPE || 'mongodb'; // 'mongodb' or 'postgresql'

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/heal-uttam-sahayak', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// PostgreSQL Connection (Sequelize)
const connectPostgreSQL = async () => {
  const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/heal-uttam-sahayak', {
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('✓ PostgreSQL connected successfully');
    return sequelize;
  } catch (error) {
    console.error('✗ PostgreSQL connection failed:', error.message);
    process.exit(1);
  }
};

// Main connection handler
const connectDatabase = async () => {
  if (DB_TYPE === 'mongodb') {
    await connectMongoDB();
  } else if (DB_TYPE === 'postgresql') {
    return await connectPostgreSQL();
  } else {
    console.warn('No database type specified. Skipping database connection.');
  }
};

module.exports = { connectDatabase, mongoose };
