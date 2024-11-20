import type { Metadata } from "next";

export const generateExamMetadata = (title: string): Metadata => ({
  title: `${title} - MemorAIze Exam Mode`,
  description: `Test your knowledge of ${title} with AI-powered assessment and adaptive learning.`,
  openGraph: {
    title: `${title} - MemorAIze Exam Mode`,
    description: `Smart testing and progress tracking for ${title}.`,
    url: `https://memoraize-ai.vercel.app/flashcards/exam/${title}`,
  },
}); 