import type { Metadata } from 'next';
import './compiled.css';

export const metadata: Metadata = {
  title: 'FORMORA 3D — AI Product Packaging Studio',
  description: 'Professional 3D Packaging Design and Visualization Studio for Windows and Web',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-slate-100 antialiased overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
