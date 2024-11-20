import { Metadata } from 'next';
import { generateFlashcardMetadata } from '@/app/metadata/flashcard';


export async function generateMetadata({ 
  params 
}: { 
  params: any 
}): Promise<Metadata> {
  return generateFlashcardMetadata(params.slug);
}

export default function FlashcardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 