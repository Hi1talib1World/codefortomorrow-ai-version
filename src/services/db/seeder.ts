import mongoose from 'mongoose';
import User from '../../models/user.model';
import Progress from '../../models/progress.model';
import SkillState from '../../models/skillState.model';
import Course from '../../models/course.model';
import Lesson from '../../models/lesson.model';
import Exercise from '../../models/exercise.model';
import Quiz from '../../models/Quiz';
import Activity from '../../models/Activity';
import Message from '../../models/Message';
import Notification from '../../models/notification.model';
import bcrypt from 'bcryptjs';

export const seedMockData = async () => {
  try {
    // 1. Check if we already have users. If yes, skip seeding.
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('🌱 Database already seeded. Skipping seeder.');
      return;
    }

    console.log('🌱 Seeding database with mock users and educational data...');

    // 2. Hash default password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Password123!', salt);

    // 3. Create Progress records for Admin, Teachers, and Students
    
    // Admin Progress (Hicham)
    const adminProgress = await Progress.create({
      xp: 1250,
      streak: 12,
      completedLessons: new Map([
        ['block_coding', [1, 2, 3, 4, 5]],
        ['javascript', [1, 2, 3]],
        ['python', [1, 2]]
      ]),
      skillMastery: new Map([
        ['block_coding', 85],
        ['javascript', 60],
        ['python', 45]
      ]),
      learningProfile: {
        strengths: ['Algorithmic Thinking', 'Logic Flow'],
        weaknesses: ['Syntax Precision'],
        recommendations: ['Practice writing TypeScript interfaces', 'Complete the recursion challenges'],
        lastAIUpdate: new Date()
      },
      lastLessonCompletedDate: new Date(Date.now() - 3600000 * 4), // 4 hours ago
      lastLeaderboardRank: 3
    });

    // Student 1: Yassine Benslimane (XP: 1500, rank 1)
    const yassineProgress = await Progress.create({
      xp: 1500,
      streak: 15,
      completedLessons: new Map([
        ['block_coding', [1, 2, 3, 4, 5, 6, 7, 8]],
        ['javascript', [1, 2, 3, 4, 5]]
      ]),
      skillMastery: new Map([
        ['block_coding', 95],
        ['javascript', 75]
      ]),
      learningProfile: {
        strengths: ['Looping Logic', 'Variable Scope'],
        weaknesses: ['Recursion'],
        recommendations: ['Study tree traversal algorithms'],
        lastAIUpdate: new Date()
      },
      lastLessonCompletedDate: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      lastLeaderboardRank: 1
    });

    // Student 2: Sofia Alami (XP: 1100, rank 2)
    const sofiaProgress = await Progress.create({
      xp: 1100,
      streak: 7,
      completedLessons: new Map([
        ['block_coding', [1, 2, 3, 4, 5]],
        ['javascript', [1, 2]]
      ]),
      skillMastery: new Map([
        ['block_coding', 80],
        ['javascript', 50]
      ]),
      learningProfile: {
        strengths: ['Conditional Statements'],
        weaknesses: ['Array Manipulation'],
        recommendations: ['Solve the Javascript filter/map array exercises'],
        lastAIUpdate: new Date()
      },
      lastLessonCompletedDate: new Date(Date.now() - 3600000 * 18), // 18 hours ago
      lastLeaderboardRank: 2
    });

    // Student 3: Kenza Alaoui (XP: 950)
    const kenzaProgress = await Progress.create({
      xp: 950,
      streak: 6,
      completedLessons: new Map([
        ['block_coding', [1, 2, 3, 4, 5]],
        ['javascript', [1]]
      ]),
      skillMastery: new Map([
        ['block_coding', 75],
        ['javascript', 25]
      ]),
      learningProfile: {
        strengths: ['HTML Structure', 'Inline Styles'],
        weaknesses: ['JavaScript Loops'],
        recommendations: ['Solve the repeat loops challenges in block coding', 'Practice CSS Grid layouts'],
        lastAIUpdate: new Date()
      },
      lastLessonCompletedDate: new Date(Date.now() - 3600000 * 5), // 5 hours ago
      lastLeaderboardRank: 4
    });

    // Student 4: Amine Kadiri (XP: 800)
    const amineProgress = await Progress.create({
      xp: 800,
      streak: 4,
      completedLessons: new Map([
        ['block_coding', [1, 2, 3, 4]]
      ]),
      skillMastery: new Map([
        ['block_coding', 70]
      ]),
      learningProfile: {
        strengths: ['Scratch logic block sequences'],
        weaknesses: ['Variables definition'],
        recommendations: ['Re-run variables lessons'],
        lastAIUpdate: new Date()
      },
      lastLessonCompletedDate: new Date(Date.now() - 3600000 * 25), // 25 hours ago
      lastLeaderboardRank: 5
    });

    // Student 5: Karim Tazi (XP: 620)
    const karimProgress = await Progress.create({
      xp: 620,
      streak: 3,
      completedLessons: new Map([
        ['block_coding', [1, 2, 3]]
      ]),
      skillMastery: new Map([
        ['block_coding', 55]
      ]),
      learningProfile: {
        strengths: ['Variable Declarations'],
        weaknesses: ['Function Scopes'],
        recommendations: ['Review the block scope vs function scope Javascript lesson'],
        lastAIUpdate: new Date()
      },
      lastLessonCompletedDate: new Date(Date.now() - 3600000 * 30), // 30 hours ago
      lastLeaderboardRank: 6
    });

    // Student 6: Lina Tagma (XP: 450)
    const linaProgress = await Progress.create({
      xp: 450,
      streak: 2,
      completedLessons: new Map([
        ['block_coding', [1, 2]]
      ]),
      skillMastery: new Map([
        ['block_coding', 40]
      ]),
      learningProfile: {
        strengths: ['Enthusiasm'],
        weaknesses: ['Loop structures'],
        recommendations: ['Try building simple repeat loops in Scratch'],
        lastAIUpdate: new Date()
      },
      lastLessonCompletedDate: new Date(Date.now() - 3600000 * 12), // 12 hours ago
      lastLeaderboardRank: 7
    });

    // Student 7: Fatima Zahra (XP: 300)
    const fatimaProgress = await Progress.create({
      xp: 300,
      streak: 1,
      completedLessons: new Map([
        ['block_coding', [1]]
      ]),
      skillMastery: new Map([
        ['block_coding', 30]
      ]),
      learningProfile: {
        strengths: ['Drag-and-drop sequencing'],
        weaknesses: ['Logic operators'],
        recommendations: ['Try the conditional maze levels'],
        lastAIUpdate: new Date()
      },
      lastLessonCompletedDate: new Date(Date.now() - 3600000 * 48), // 48 hours ago
      lastLeaderboardRank: 8
    });

    // Empty Progress documents for Teachers
    const aminaProg = await Progress.create({ xp: 0, streak: 0 });
    const mohamedProg = await Progress.create({ xp: 0, streak: 0 });
    const tarikProg = await Progress.create({ xp: 0, streak: 0 });
    const leilaProg = await Progress.create({ xp: 0, streak: 0 });

    // 4. Create Users
    
    // Admin: Hicham Outaleb
    const adminUser = await User.create({
      name: 'Hicham Outaleb',
      email: 'hichamoutaleb7@gmail.com',
      password: passwordHash,
      role: 'admin',
      profilePictureUrl: 'https://ui-avatars.com/api/?name=Hicham+Outaleb&background=0284c7&color=fff',
      progress: adminProgress._id,
      bio: 'Passionate educator and software engineer. Building the future of technology education in Morocco.',
      professionalTitle: 'Director of AI & Operations',
      skills: ['TypeScript', 'MongoDB', 'Next.js', 'Python', 'Machine Learning', 'Systems Architecture'],
      emailVerified: true
    });

    // Teachers
    const teacherAmina = await User.create({
      name: 'Dr. Amina Bennani',
      email: 'amina@cft.org',
      password: passwordHash,
      role: 'teacher',
      profilePictureUrl: 'https://ui-avatars.com/api/?name=Amina+Bennani&background=10b981&color=fff',
      progress: aminaProg._id,
      bio: 'Computer Science Professor at UM6P. Dedicated to mentoring young developers in Web Technologies and Data Structures.',
      professionalTitle: 'Computer Science Professor',
      skills: ['Algorithms', 'Java', 'Web Technologies', 'React', 'Mentorship'],
      emailVerified: true
    });

    const teacherMohamed = await User.create({
      name: 'Mohamed El Fassi',
      email: 'mohamed@cft.org',
      password: passwordHash,
      role: 'teacher',
      profilePictureUrl: 'https://ui-avatars.com/api/?name=Mohamed+El+Fassi&background=f59e0b&color=fff',
      progress: mohamedProg._id,
      bio: 'Lead Scratch Mentor. Introducing coding concepts to school kids using block-based programming.',
      professionalTitle: 'Lead Scratch Mentor',
      skills: ['Block Coding', 'Scratch', 'Pedagogy', 'Python for Kids'],
      emailVerified: true
    });

    const teacherTarik = await User.create({
      name: 'Dr. Tarik Mansouri',
      email: 'tarik@cft.org',
      password: passwordHash,
      role: 'teacher',
      profilePictureUrl: 'https://ui-avatars.com/api/?name=Tarik+Mansouri&background=3b82f6&color=fff',
      progress: tarikProg._id,
      bio: 'Data Science researcher at UM6P. Passionate about teaching Python, data visualization, and machine learning to young minds.',
      professionalTitle: 'Data Science Mentor',
      skills: ['Python', 'Data Science', 'Machine Learning', 'Pandas', 'SQL'],
      emailVerified: true
    });

    const teacherLeila = await User.create({
      name: 'Leila Haddad',
      email: 'leila@cft.org',
      password: passwordHash,
      role: 'teacher',
      profilePictureUrl: 'https://ui-avatars.com/api/?name=Leila+Haddad&background=ec4899&color=fff',
      progress: leilaProg._id,
      bio: 'Full-Stack Developer and bootcamp instructor. Guiding students in building responsive websites with HTML, CSS, and modern JavaScript.',
      professionalTitle: 'Web Development Mentor',
      skills: ['JavaScript', 'React', 'CSS Flexbox/Grid', 'Git', 'UX/UI'],
      emailVerified: true
    });

    // Students
    const studentYassine = await User.create({
      name: 'Yassine Benslimane',
      email: 'yassine@cft.org',
      password: passwordHash,
      role: 'student',
      profilePictureUrl: 'https://ui-avatars.com/api/?name=Yassine+Benslimane&background=ef4444&color=fff',
      progress: yassineProgress._id,
      bio: 'High school student dreaming of building the next big startup. Loving the JS tracks!',
      professionalTitle: 'Student Coder',
      skills: ['HTML/CSS', 'JavaScript', 'Scratch', 'Game Logic'],
      emailVerified: true
    });

    const studentSofia = await User.create({
      name: 'Sofia Alami',
      email: 'sofia@cft.org',
      password: passwordHash,
      role: 'student',
      profilePictureUrl: 'https://ui-avatars.com/api/?name=Sofia+Alami&background=8b5cf6&color=fff',
      progress: sofiaProgress._id,
      bio: 'Enthusiastic beginner coder eager to master Python and Javascript.',
      professionalTitle: 'Student Coder',
      skills: ['HTML', 'Scratch'],
      emailVerified: true
    });

    const studentKenza = await User.create({
      name: 'Kenza Alaoui',
      email: 'kenza@cft.org',
      password: passwordHash,
      role: 'student',
      profilePictureUrl: 'https://ui-avatars.com/api/?name=Kenza+Alaoui&background=14b8a6&color=fff',
      progress: kenzaProgress._id,
      bio: 'Love creating responsive web interfaces and styling pages.',
      professionalTitle: 'Student Front-End Developer',
      skills: ['HTML', 'CSS', 'Figma'],
      emailVerified: true
    });

    const studentAmine = await User.create({
      name: 'Amine Kadiri',
      email: 'amine@cft.org',
      password: passwordHash,
      role: 'student',
      profilePictureUrl: 'https://ui-avatars.com/api/?name=Amine+Kadiri&background=ec4899&color=fff',
      progress: amineProgress._id,
      bio: 'Learning coding through gaming projects.',
      professionalTitle: 'Student Coder',
      skills: ['Scratch'],
      emailVerified: true
    });

    const studentKarim = await User.create({
      name: 'Karim Tazi',
      email: 'karim@cft.org',
      password: passwordHash,
      role: 'student',
      profilePictureUrl: 'https://ui-avatars.com/api/?name=Karim+Tazi&background=6366f1&color=fff',
      progress: karimProgress._id,
      bio: 'Passionate about building logic games and algorithms.',
      professionalTitle: 'Student Python Developer',
      skills: ['Python', 'Block Coding'],
      emailVerified: true
    });

    const studentLina = await User.create({
      name: 'Lina Tagma',
      email: 'lina@cft.org',
      password: passwordHash,
      role: 'student',
      profilePictureUrl: 'https://ui-avatars.com/api/?name=Lina+Tagma&background=06b6d4&color=fff',
      progress: linaProgress._id,
      bio: 'Exploring block programming concepts.',
      professionalTitle: 'Student Coder',
      skills: ['Scratch'],
      emailVerified: true
    });

    const studentFatima = await User.create({
      name: 'Fatima Zahra',
      email: 'fatima@cft.org',
      password: passwordHash,
      role: 'student',
      profilePictureUrl: 'https://ui-avatars.com/api/?name=Fatima+Zra&background=f43f5e&color=fff',
      progress: fatimaProgress._id,
      bio: 'Beginning coder. Excited to start the block coding pathways!',
      professionalTitle: 'Beginning Coder',
      skills: ['Block Coding'],
      emailVerified: true
    });

    // 5. Create SkillStates for all students
    const paths = ['block_coding', 'javascript', 'python', 'web_dev'];
    
    // Helper to generate skill state entries
    const makeSkillStates = async (studentId: string, skillsMap: Record<string, number>) => {
      for (const path of paths) {
        const prof = skillsMap[path] || 0;
        if (prof > 0 || path === 'block_coding') {
          await SkillState.create({
            student_id: studentId,
            skill_id: path,
            proficiency: prof / 100,
            successes: Math.round(prof / 10),
            attempts: Math.round(prof / 8) + 2,
            trend: prof > 50 ? 'improving' : 'stable',
            confidence: prof / 120,
            updated_at: new Date()
          });
        }
      }
    };

    await makeSkillStates(adminUser._id.toString(), { block_coding: 85, javascript: 60, python: 45 });
    await makeSkillStates(studentYassine._id.toString(), { block_coding: 95, javascript: 75 });
    await makeSkillStates(studentSofia._id.toString(), { block_coding: 80, javascript: 50 });
    await makeSkillStates(studentKenza._id.toString(), { block_coding: 75, javascript: 25 });
    await makeSkillStates(studentAmine._id.toString(), { block_coding: 70 });
    await makeSkillStates(studentKarim._id.toString(), { block_coding: 55 });
    await makeSkillStates(studentLina._id.toString(), { block_coding: 40 });
    await makeSkillStates(studentFatima._id.toString(), { block_coding: 30 });

    // 6. Create Courses, Lessons, and Exercises
    
    // Course 1: Block Coding Essentials
    const courseBlock = await Course.create({
      title: 'Block Coding Essentials',
      description: 'Master programming logic visually using drag-and-drop Scratch-like programming blocks.',
      lessons: [],
      owner: teacherMohamed._id
    });

    const lessonBlock1 = await Lesson.create({
      course: courseBlock._id,
      title: 'Introduction to Maze Navigation',
      description: 'Learn simple sequence blocks like Move Forward, Turn Right, and Turn Left to navigate a grid robot.',
      exercises: [],
      xp: 10
    });

    const exerciseBlock1_1 = await Exercise.create({
      lesson: lessonBlock1._id,
      instruction: 'Drag blocks to make the robot move forward 3 steps and reach the golden star.',
      starterCode: '// moveForward();',
      solutionCode: 'moveForward();\nmoveForward();\nmoveForward();',
      expectedOutput: 'success'
    });

    lessonBlock1.exercises.push(exerciseBlock1_1._id);
    await lessonBlock1.save();
    courseBlock.lessons.push(lessonBlock1._id);
    await courseBlock.save();

    // Course 2: JavaScript Fundamentals
    const courseJS = await Course.create({
      title: 'JavaScript Fundamentals',
      description: 'Dive into real text programming. Build dynamic interactive web algorithms using modern JavaScript.',
      lessons: [],
      owner: teacherAmina._id
    });

    const lessonJS1 = await Lesson.create({
      course: courseJS._id,
      title: 'Variables and Constants',
      description: 'Understand how computers store values using let, const, and var declaration expressions.',
      exercises: [],
      xp: 10
    });

    const exerciseJS1_1 = await Exercise.create({
      lesson: lessonJS1._id,
      instruction: 'Declare a constant named AGE and initialize it to the value 25.',
      starterCode: '// Write your code below\n',
      solutionCode: 'const AGE = 25;',
      expectedOutput: 'AGE = 25'
    });

    lessonJS1.exercises.push(exerciseJS1_1._id);
    await lessonJS1.save();
    courseJS.lessons.push(lessonJS1._id);
    await courseJS.save();

    // 7. Create Quizzes
    await Quiz.create({
      title: 'Block Coding Loops Challenge',
      description: 'Test your understanding of loop bounds, repeat-until statements, and infinite execution loops.',
      teacher: teacherMohamed._id,
      assignedClasses: ['Class A', 'Class B'],
      dueDate: new Date(Date.now() + 3600000 * 24 * 5), // 5 days from now
      questions: [
        {
          question: 'How many times will a "Repeat 5" block execute its contents?',
          options: ['4 times', '5 times', '6 times', 'Infinite times'],
          correctAnswer: '5 times',
          explanation: 'A repeat block runs its body exactly the number of times specified (5).'
        },
        {
          question: 'What happens when you create a repeat-until loop with a condition that is always false?',
          options: ['The loop never runs', 'The loop runs once', 'The loop runs forever', 'The program throws an error'],
          correctAnswer: 'The loop runs forever',
          explanation: 'A repeat-until loop continues until the condition becomes true. If it stays false forever, the loop never terminates.'
        }
      ]
    });

    await Quiz.create({
      title: 'JavaScript Variables & Scope Quiz',
      description: 'Assess variables declarations and block-scope differences between let and var.',
      teacher: teacherAmina._id,
      assignedClasses: ['Class A'],
      dueDate: new Date(Date.now() + 3600000 * 24 * 3), // 3 days from now
      questions: [
        {
          question: 'Which keyword defines a block-scoped reassignable variable in ES6?',
          options: ['var', 'let', 'const', 'define'],
          correctAnswer: 'let',
          explanation: 'let defines a block-scoped variable that can be updated. const is read-only, and var is function-scoped.'
        }
      ]
    });

    // 8. Create Classroom Activities
    await Activity.create({
      title: 'Robot Maze Pathfinding Relay',
      description: 'Divide class into teams. Each team writes sequential block coding blocks to solve a complex grid maze.',
      teacher: teacherMohamed._id,
      targetGrade: 'Middle School (6-8)',
      duration: 45,
      materials: ['Paper grid sheets', 'Scratch offline editor', 'Interactive smartboard'],
      steps: [
        { title: 'Intro & Maze Rules', description: 'Introduce the target maze and allowed movement nodes.', duration: 10 },
        { title: 'Team Algorithm Drafting', description: 'Teams discuss and write their pseudocode programs on grid sheets.', duration: 20 },
        { title: 'Testing & Execution Relay', description: 'Run programs on the editor. First team to reach the target wins.', duration: 15 }
      ],
      isPublic: true
    });

    await Activity.create({
      title: 'Introductory HTML Landing Page Workshop',
      description: 'Students code their very first static HTML webpage describing their dream tech project.',
      teacher: teacherAmina._id,
      targetGrade: 'High School (9-12)',
      duration: 60,
      materials: ['Computers with VS Code', 'HTML Cheat sheets'],
      steps: [
        { title: 'HTML Tags Overview', description: 'Explain tags like h1, p, div, and anchor links.', duration: 15 },
        { title: 'Live Coding Demo', description: 'Walk through creating a basic index.html file.', duration: 15 },
        { title: 'Independent Practice', description: 'Students design and write their own custom pages.', duration: 30 }
      ],
      isPublic: true
    });

    // 9. Create Messages (Chat History)
    
    // Amina (Teacher) <-> Admin
    await Message.create({
      sender: teacherAmina._id,
      receiver: adminUser._id,
      content: 'Hello Hicham, I checked your progress and your JS exercises scores are excellent. Would you be interested in assisting in our next HTML workshop?',
      createdAt: new Date(Date.now() - 3600000 * 2)
    });
    await Message.create({
      sender: adminUser._id,
      receiver: teacherAmina._id,
      content: 'Hello Professor Bennani! Yes, that sounds amazing. I would love to help mentor the new high school students. Let me know what date works best.',
      createdAt: new Date(Date.now() - 3600000 * 1.8)
    });

    // Student Yassine <-> Admin
    await Message.create({
      sender: studentYassine._id,
      receiver: adminUser._id,
      content: 'Hey Hicham, did you solve the intermediate array sorting exercise in the JS module? I am getting stuck on the callback sorting function.',
      createdAt: new Date(Date.now() - 3600000 * 1)
    });
    await Message.create({
      sender: adminUser._id,
      receiver: studentYassine._id,
      content: 'Hey Yassine! Yes, remember that array.sort() takes a comparison function. If you are sorting numbers, pass (a, b) => a - b to sort in ascending order. Let me know if that works!',
      createdAt: new Date(Date.now() - 3600000 * 0.9)
    });

    // 10. Create Notifications for Admin User
    await Notification.create({
      userId: adminUser._id.toString(),
      title: 'Rank Up! 🏆',
      message: 'Congratulations! You climbed to Rank #3 on the global leaderboard.',
      type: 'leaderboard_rank_change',
      read: false
    });

    await Notification.create({
      userId: adminUser._id.toString(),
      title: 'New Courses Unlocked! 🔓',
      message: 'Congratulations! Your Block Coding progress reached 30%. Python and JavaScript pathways are now unlocked!',
      type: 'course_unlocked',
      read: true
    });

    await Notification.create({
      userId: adminUser._id.toString(),
      title: 'Challenge Complete! 🎉',
      message: 'You completed a new JavaScript challenge! You earned +10 XP. Streak active: 12 days! 🔥',
      type: 'lesson_completed',
      read: false
    });

    console.log('🌱 Mock data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding mock database:', error);
  }
};
