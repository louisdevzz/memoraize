import type { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: 'MemorAIze - AI-Powered Learning Platform',
  description: 'Revolutionize your learning with MemorAIze. AI-powered flashcards and smart study techniques for efficient knowledge retention.',
  keywords: [
    'MemorAIze',
    'AI learning',
    'smart flashcards',
    'spaced repetition',
    'personalized learning',
    'education technology',
    'memory training',
    'artificial intelligence'
  ],
  authors: [{ name: 'Louisdevzz' }],
  creator: 'Louisdevzz',
  publisher: 'Louisdevzz',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://memoraize.vercel.app/',
    siteName: 'MemorAIze',
    title: 'MemorAIze - AI-Powered Learning Platform',
    description: 'Transform your learning experience with AI-powered flashcards and personalized study techniques.',
    images: [
      {
        url: 'https://memoraize.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MemorAIze Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MemorAIze - AI-Powered Learning Platform',
    description: 'Transform your learning experience with AI-powered flashcards.',
    images: ['https://memoraize.vercel.app/og-image.jpg'],
    creator: '@_huu_nhnz04',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    } as any,
  },
}; 