import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'III Nexus Launcher',
  description: 'A central launcher for III sub-apps including Clubspace, Canteen, AI Content Detector, and Skiptray.',
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
