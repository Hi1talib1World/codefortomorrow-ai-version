import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IProgress } from './progress.model';

// Interface to define the structure of a User document for TypeScript
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  profilePictureUrl: string;
  role: 'student' | 'teacher' | 'admin';
  // FIX: Corrected the type for the 'progress' field to 'mongoose.Types.ObjectId'. The previous type `IProgress['_id']` was causing a compilation error.
  progress: mongoose.Types.ObjectId; // This will store the ObjectId of the user's progress document
  savedRepos?: string[];
  savedPosts?: string[];
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  bio?: string;
  coverPictureUrl?: string;
  currentPath?: string | null;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  professionalTitle?: string;
  skills?: string[];
}

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: false, // Not required for users signing up with Google OAuth
    minlength: 6,
    select: false,
  },
  googleId: {
    type: String,
    required: false,
  },
  profilePictureUrl: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=C+C&background=random&color=fff',
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
  savedRepos: [{ type: String }],
  savedPosts: [{ type: String }],
  emailVerified: {
    type: Boolean,
    default: false,
  },
  classroomCode: { type: String, required: false },
  bio: {
    type: String,
    default: '',
  },
  coverPictureUrl: {
    type: String,
    default: '',
  },
  currentPath: {
    type: String,
    default: null,
  },
  githubUrl: {
    type: String,
    default: '',
  },
  linkedinUrl: {
    type: String,
    default: '',
  },
  websiteUrl: {
    type: String,
    default: '',
  },
  professionalTitle: {
    type: String,
    default: '',
  },
  skills: [{
    type: String,
  }],
  progress: {
    type: Schema.Types.ObjectId,
    ref: 'Progress', // This creates the link to the Progress model
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Mongoose "pre-save hook": This function runs before a document is saved to the database.
// We use a standard function declaration here to ensure `this` refers to the user document.
userSchema.pre<IUser>('save', async function() {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password') || !this.password) {
    return;
  }

  try {
    // Hash the password with a salt round of 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    // If an error occurs, throw it so Mongoose can handle it
    throw error;
  }
});

/**
 * How this connects to MongoDB:
 * 
 * 1. Schema Definition: The `userSchema` and `progressSchema` you've defined are blueprints.
 *    They tell Mongoose what shape the documents should have.
 * 
 * 2. Model Creation: `mongoose.model('User', userSchema)` compiles the schema into a model.
 *    A model is a constructor that allows you to interact with a specific MongoDB collection.
 * 
 * 3. Collection Mapping: By default, Mongoose will map the 'User' model to a collection
 *    named 'users' (pluralized and lowercased) in your MongoDB database. Similarly, the
 *    'Progress' model maps to a 'progresses' collection.
 * 
 * When you use methods like `User.create({...})` or `new User({...}).save()`, Mongoose
 * constructs a document that conforms to your schema and sends the command to MongoDB
 * to insert it into the 'users' collection.
 */
const User = mongoose.model<IUser>('User', userSchema);

export default User;
