import mongoose, { Document } from 'mongoose';

// Define the interface for User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Delete existing model if it exists in a development environment
if (process.env.NODE_ENV !== 'production') {
  if (mongoose.models.users) {
    delete mongoose.models.users;
  }
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
}, { timestamps: true });

// Use a try-catch to handle model creation
let User: mongoose.Model<IUser>;
try {
  User = mongoose.model<IUser>('users', UserSchema);
} catch (error) {
  User = mongoose.model<IUser>('users');
}

export default User; 