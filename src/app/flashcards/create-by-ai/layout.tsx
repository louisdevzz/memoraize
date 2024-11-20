import { createAIFlashcardMetadata } from '@/app/metadata/create-ai';

export const metadata = createAIFlashcardMetadata;

export default function CreateAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 