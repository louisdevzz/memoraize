import mongoose, { Document } from 'mongoose';

export type FlashcardType = 'text' | 'image' | 'multipleChoice' | 'audio';

interface BaseFlashcard {
  type: FlashcardType;
  front: string;
  back: string;
}

interface TextFlashcard extends BaseFlashcard {
  type: 'text';
}

interface ImageFlashcard extends BaseFlashcard {
  type: 'image';
  imageUrl: string;
}

interface MultipleChoiceFlashcard extends BaseFlashcard {
  type: 'multipleChoice';
  options: string[];
  correctOption: string;
}

interface AudioFlashcard extends BaseFlashcard {
  type: 'audio';
  audioUrl: string;
}

export type Flashcard = TextFlashcard | ImageFlashcard | MultipleChoiceFlashcard | AudioFlashcard;

// Define the interface for Lesson document
export interface ILesson extends Document {
  title: string;
  description: string;
  flashcards: Flashcard[];
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

const FlashcardSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'image', 'multipleChoice', 'audio'],
    required: true,
  },
  front: {
    type: String,
    required: true,
  },
  back: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: function(this: Flashcard) { return this.type === 'image'; }
  },
  audioUrl: {
    type: String,
    required: function(this: Flashcard) { return this.type === 'audio'; }
  },
  options: {
    type: [String],
    required: function(this: Flashcard) { return this.type === 'multipleChoice'; }
  },
  correctOption: {
    type: String,
    required: function(this: Flashcard) { return this.type === 'multipleChoice'; }
  }
});

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  flashcards: [FlashcardSchema],
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
