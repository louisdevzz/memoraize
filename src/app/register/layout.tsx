import { registerMetadata } from '../metadata/register';

export const metadata = registerMetadata;

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 