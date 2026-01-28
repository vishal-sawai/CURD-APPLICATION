import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Investment Tracker",
  description: "Track and manage your investments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <Sidebar />
          <MainContent>
            {children}
          </MainContent>
        </SessionProvider>
        <footer className="mt-auto py-6 border-t border-gray-200">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600">
            <p className="mb-2">
              <span className="font-semibold">Vishal Sawai</span>
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/Vishal-Sawai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/vishal-sawai-5462b9186/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
