import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.model';
import bcrypt from 'bcryptjs';

// Load env variables (including ADMIN_EMAILS)
dotenv.config();

const ADMIN_EMAIL = 'hichamoutaleb7@gmail.com';
const DEFAULT_PASSWORD = 'ChangeMe123!'; // You should change after first login

async function createAdminIfMissing() {
  try {
    // Connect to MongoDB (using the same connection logic as the app)
    await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log(`🔧 Updated existing user ${ADMIN_EMAIL} to admin role`);
      } else {
        console.log(`✅ Admin user ${ADMIN_EMAIL} already exists`);
      }
      return;
    }

    // Hash the default password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(DEFAULT_PASSWORD, salt);

    const newAdmin = new User({
      name: 'Hicham Outaleb',
      email: ADMIN_EMAIL,
      password: hashed,
      role: 'admin',
    });
    await newAdmin.save();
    console.log(`🆕 Created admin user ${ADMIN_EMAIL} with default password`);
  } catch (err) {
    console.error('❌ Error creating admin user:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createAdminIfMissing();
