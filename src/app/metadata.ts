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
    'artificial intelligence',
    'học tập thông minh',
    'thẻ ghi nhớ',
    'ôn thi hiệu quả',
    'học với AI',
    'công cụ học tập',
    'memorize cards',
    'study tools',
    'learning assistant',
    'AI study helper',
    'free flashcards'
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
    url: 'https://memoraize-ai.vercel.app/',
    siteName: 'MemorAIze',
    title: 'MemorAIze - AI-Powered Learning Platform',
    description: 'Transform your learning experience with AI-powered flashcards and personalized study techniques.',
    images: [
      {
        url: 'https://memoraize-ai.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MemorAIze Platform',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MemorAIze - AI-Powered Learning Platform',
    description: 'Transform your learning experience with AI-powered flashcards.',
    images: {
      url: 'https://memoraize-ai.vercel.app/og-image.jpg',
      width: 1200,
      height: 600,
      alt: 'MemorAIze Platform',
      type: 'image/jpeg',
    },
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
  metadataBase: new URL('https://memoraize-ai.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'vi-VN': '/vi-VN',
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    // Add other search engine verification codes
  },
  category: 'education',
  classification: 'Education Technology',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}; 