import type { Metadata } from "next";

export const generateFlashcardMetadata = (title: string): Metadata => ({
  title: `${title} - MemorAIze Study Set`,
  description: `Master ${title} with AI-enhanced flashcards and smart learning techniques.`,
  openGraph: {
    title: `${title} - MemorAIze Study Set`,
    description: `Study ${title} efficiently with AI-powered learning tools.`,
    url: `https://memoraize.vercel.app/flashcards/${title}`,
  },
}); 