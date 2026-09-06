import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'III Nexus Launcher',
  description: 'A central launcher for III sub-apps including Clubspace, Canteen, AI Content Detector, and Skiptray.',
  keywords: ['Nexus', 'III', 'Launcher', 'Clubspace', 'Canteen', 'AI Content Detector', 'Skiptray', 'Student Portal'],
  authors: [{ name: 'III Nexus Team' }],
  openGraph: {
    title: 'III Nexus Launcher',
    description: 'A central launcher for III sub-apps including Clubspace, Canteen, AI Content Detector, and Skiptray.',
    url: 'https://iii-nexus.vercel.app',
    siteName: 'III Nexus',
    images: [
      {
        url: 'https://iii-nexus.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'III Nexus Launcher',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'III Nexus Launcher',
    description: 'A central launcher for III sub-apps including Clubspace, Canteen, AI Content Detector, and Skiptray.',
    images: ['https://iii-nexus.vercel.app/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#f0f2f5] text-slate-900 antialiased font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
