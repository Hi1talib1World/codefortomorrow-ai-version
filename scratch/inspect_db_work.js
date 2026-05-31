import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function inspect() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not defined in environment variables');
    return;
  }
  console.log('Connecting to MONGO_URI...');
  try {
    await mongoose.connect(uri);
    console.log('Connected successfully!');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:');
    collections.forEach(c => console.log(' -', c.name));

    // Inspect user count
    const userCount = await db.collection('users').countDocuments();
    console.log('User count:', userCount);

    // Inspect skill states
    const skillStatesCount = await db.collection('skill_states').countDocuments();
    console.log('Skill States count:', skillStatesCount);
    const skillStates = await db.collection('skill_states').find().limit(3).toArray();
    console.log('Sample Skill States:', JSON.stringify(skillStates, null, 2));

    // Inspect learning events
    const eventsCount = await db.collection('learning_events').countDocuments();
    console.log('Learning Events count:', eventsCount);
    const events = await db.collection('learning_events').find().limit(3).toArray();
    console.log('Sample Learning Events:', JSON.stringify(events, null, 2));

  } catch (err) {
    console.error('Error during inspection:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

inspect();
