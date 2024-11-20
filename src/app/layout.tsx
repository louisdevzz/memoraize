import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import StyledComponentsRegistry from '../lib/registry'
import { Suspense } from "react";
import Loader from "@/components/Loader";
import { defaultMetadata } from './metadata';
import { Toaster } from 'react-hot-toast';

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <Suspense fallback={<Loader />}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </Suspense>
        <Analytics />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
