import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function setAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codefortomorrow');
    const result = await mongoose.connection.db!
      .collection('users')
      .updateOne(
        { email: 'hichamoutaleb7@gmail.com' },
        { $set: { role: 'admin' } }
      );
    console.log('✅ Done! Matched:', result.matchedCount, '| Modified:', result.modifiedCount);
    if (result.matchedCount === 0) {
      console.log('⚠️  No user found with that email. Have you logged in yet?');
    }
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

setAdmin();
