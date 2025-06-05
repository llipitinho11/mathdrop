import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Ensure Toaster is imported

export const metadata: Metadata = {
  title: 'Mathdrop',
  description: 'Matemática nos Jogos Virtuais',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        {children}
        <Toaster /> {/* Add Toaster for notifications */}
      </body>
    </html>
  );
}
