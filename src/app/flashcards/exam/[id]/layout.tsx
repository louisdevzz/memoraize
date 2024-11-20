import { generateExamMetadata } from '../../../metadata/exam';

export async function generateMetadata({ params }: { params: { id: string } }) {
  return generateExamMetadata(params.id);
}

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 