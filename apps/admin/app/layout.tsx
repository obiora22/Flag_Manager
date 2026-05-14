import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Feature Flag Manager",
  description: "A simple and intuitive feature flag management tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.className} ${geistMono.variable} antialiased bg-gray-900`}>
        <SessionProvider>
          <main className=" bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
