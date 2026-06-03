import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AIEngine } from '../services/aiEngine';
import User from '../models/user.model';

dotenv.config();

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/codefortomorrow';
    console.log('Connecting to Mongo at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to Mongo.');

    let user = await User.findOne({ role: 'student' });
    if (!user) {
      user = await User.findOne();
    }
    
    if (!user) {
      console.log('No user found in database. Using a dummy User.');
      user = new User({
        name: 'Test Student',
        email: 'test@student.com',
        role: 'student'
      });
    } else {
      console.log('Using database user:', user.name, '(', user.email, ')');
    }

    console.log('GEMINI_API_KEY set:', !!process.env.GEMINI_API_KEY);
    console.log('Calling AIEngine.chatWithAssistant with message "Explain loops"...');
    
    const response = await AIEngine.chatWithAssistant("Explain loops", [], user);
    console.log('\n--- RESPONSE SUCCESS ---');
    console.log(response);
    console.log('------------------------\n');

  } catch (error) {
    console.error('\n--- RESPONSE ERROR ---');
    console.error(error);
    console.error('----------------------\n');
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from Mongo.');
  }
}

run();
