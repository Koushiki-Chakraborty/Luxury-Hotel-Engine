const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const checkAdminUsers = async () => {
  try {
    // Find all admin users
    const adminUsers = await User.find({ role: 'admin' });
    
    console.log(`\n📊 Found ${adminUsers.length} admin user(s):\n`);
    
    adminUsers.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user._id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}\n`);
    });
    
    // Test password for each user
    for (const user of adminUsers) {
      const userWithPassword = await User.findById(user._id).select('+password');
      const isValid = await userWithPassword.comparePassword('admin123');
      console.log(`✓ Password 'admin123' valid for ${user.email}: ${isValid}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkAdminUsers();
