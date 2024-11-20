export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MemorAIze',
  url: 'https://memoraize-ai.vercel.app/',
  description: 'AI-powered flashcards and smart study techniques for efficient knowledge retention',
  publisher: {
    '@type': 'Organization',
    name: 'MemorAIze',
    logo: {
      '@type': 'ImageObject',
      url: 'https://memoraize-ai.vercel.app/icons/icon-512x512.png'
    }
  }
};

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MemorAIze',
  url: 'https://memoraize-ai.vercel.app/',
  logo: 'https://memoraize-ai.vercel.app/icons/icon-512x512.png',
  sameAs: [
    'https://twitter.com/_huu_nhnz04'
    // Add other social media links here
  ]
}; 