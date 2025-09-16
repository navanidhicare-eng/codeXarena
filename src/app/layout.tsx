"use client";

import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Chatbot } from '@/components/Chatbot';
import { AppContextProvider } from '@/context/AppContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>CodeXarena</title>
        <meta name="description" content="Stop Grinding. Start Battling." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Roboto+Mono&family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppContextProvider>
            {children}
            <Chatbot />
            <Toaster />
        </AppContextProvider>
      </body>
    </html>
  );
}
