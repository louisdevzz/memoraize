import { generateFlashcardMetadata } from '../../metadata/flashcard';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return generateFlashcardMetadata(params.slug);
}

export default function FlashcardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 