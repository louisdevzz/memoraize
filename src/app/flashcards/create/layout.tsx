import { createFlashcardMetadata } from '@/app/metadata/create';

export const metadata = createFlashcardMetadata;

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 