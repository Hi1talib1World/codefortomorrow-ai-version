import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AIEngine } from '../src/core/ai-coach/aiEngine';
import User from '../src/models/user.model';
import connectDB from '../src/services/db/db';

dotenv.config();

async function run() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database.');

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
    
    // Test with a history turn starting with 'model' to test our history sanitization
    const history: any = [
      { role: 'model', parts: [{ text: 'Welcome hichamoutaleb7!' }] }
    ];
    
    const response = await AIEngine.chatWithAssistant("Explain loops", history, user);
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
