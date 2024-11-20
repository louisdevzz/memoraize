import { generateExamMetadata } from '@/app/metadata/exam';

export async function generateMetadata({ params }: { params: any }) {
  return generateExamMetadata(params.id);
}

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 