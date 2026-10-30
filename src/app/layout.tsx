import type { Metadata } from 'next';
import './globals.css';
import { DigiTubeProvider } from '@/lib/store';
import { ThemeProvider } from '@/lib/theme';
import { AudioPlayerModal } from '@/components/AudioPlayerModal';

export const metadata: Metadata = {
  title: 'DigiTube Network | Music Distribution & Backstage Portal',
  description:
    'Distribute music to 150+ stores worldwide including Spotify, Apple Music, YouTube Music, and JioSaavn. 9-step release wizard, automated QA, royalty ledger, and instant bank settlements.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <DigiTubeProvider>
            {children}
            <AudioPlayerModal />
          </DigiTubeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
