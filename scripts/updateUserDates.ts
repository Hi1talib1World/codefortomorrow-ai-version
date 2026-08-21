import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../src/services/db/db';
import User from '../src/models/user.model';
import Progress from '../src/models/progress.model';

dotenv.config();

// March 3, 2026 00:00:00 UTC
const START_DATE = new Date('2026-03-03T00:00:00.000Z').getTime();
// July 26, 2026 23:59:59 UTC
const END_DATE = new Date('2026-07-26T23:59:59.000Z').getTime();

function getRandomDateBetween(startMs: number, endMs: number): Date {
  const randomMs = startMs + Math.random() * (endMs - startMs);
  return new Date(randomMs);
}

async function updateAccountDates() {
  console.log('Connecting to database...');
  await connectDB();

  // Find all student users
  const studentUsers = await User.find({ role: 'student' });
  console.log(`Found ${studentUsers.length} student users to update registration & activity dates.`);

  let updatedCount = 0;

  for (let i = 0; i < studentUsers.length; i++) {
    const user = studentUsers[i];
    const randomDate = getRandomDateBetween(START_DATE, END_DATE);

    // Update User collection raw dates using updateOne to bypass automatic timestamps middleware if any
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          createdAt: randomDate,
          updatedAt: randomDate
        }
      }
    );

    // Update linked Progress document if present
    if (user.progress) {
      await Progress.updateOne(
        { _id: user.progress },
        {
          $set: {
            createdAt: randomDate,
            updatedAt: randomDate,
            lastLessonCompletedDate: randomDate,
            'learningProfile.lastAIUpdate': randomDate
          }
        }
      );
    }

    updatedCount++;
    if (updatedCount % 50 === 0 || updatedCount === studentUsers.length) {
      console.log(`Updated ${updatedCount}/${studentUsers.length} users with dates between 03/03/2026 and 26/07/2026...`);
    }
  }

  console.log('\n==========================================');
  console.log('🎉 ACCOUNT DATES UPDATED SUCCESSFULLY!');
  console.log(`Total Student Accounts Updated: ${updatedCount}`);
  console.log(`Date Range Applied: March 3, 2026 to July 26, 2026`);
  console.log('==========================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

updateAccountDates().catch(err => {
  console.error('Fatal date update error:', err);
  process.exit(1);
});
