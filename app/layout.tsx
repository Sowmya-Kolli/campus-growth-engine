import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Campus Growth Engine — Build Your First AI Project in 60 Minutes',
  description:
    'Discover an AI project idea that matches your engineering branch, join a free 60-minute workshop, and share your blueprint with classmates.',
  keywords: [
    'NxtWave',
    'AI Workshop',
    'Campus Growth Engine',
    'Final Year Engineering',
    'AI Projects',
    'Student Referral',
  ],
  authors: [{ name: 'NxtWave Growth Team' }],
  openGraph: {
    title: 'Campus Growth Engine — Free 60-Min AI Workshop',
    description: 'Build and deploy your first portfolio-ready AI project in 60 minutes. 100% Free live masterclass.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
        {children}
      </body>
    </html>
  );
}
