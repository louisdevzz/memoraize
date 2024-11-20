import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import StyledComponentsRegistry from '../lib/registry'
import { Suspense } from "react";
import Loader from "@/components/Loader";
import { defaultMetadata } from './metadata';
import { Toaster } from 'react-hot-toast';
import { websiteJsonLd, organizationJsonLd } from './jsonld'

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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#000000" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd)
          }}
        />
      </head>
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
