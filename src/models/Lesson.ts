import mongoose, { Document } from 'mongoose';

// Define the interface for Lesson document
export interface ILesson extends Document {
  title: string;
  description: string;
  flashcards: {
    front: string;
    back: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  slug: string;
}

// Delete existing model if it exists in a development environment
if (process.env.NODE_ENV !== 'production') {
  if (mongoose.models.lessons) {
    delete mongoose.models.lessons;
  }
}

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  flashcards: [{
    front: {
      type: String,
      required: true,
    },
    back: {
      type: String, 
      required: true,
    }
  }],
  userId: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  }
}, { timestamps: true });

// Use a try-catch to handle model creation
let Lesson: mongoose.Model<ILesson>;
try {
  Lesson = mongoose.model<ILesson>('lessons', LessonSchema);
} catch (error) {
  Lesson = mongoose.model<ILesson>('lessons');
}

export default Lesson;
