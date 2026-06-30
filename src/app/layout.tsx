import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codelabs ISIS3710",
  description:
    "Plataforma de codelabs interactivos para aprender tecnologías web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <header className="bg-white border-b border-step-border">
          <div className="px-4 md:px-6 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg text-primary">
              Codelabs ISIS3710
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                Codelabs
              </Link>
              <Link href="/admin" className="text-gray-400 hover:text-primary transition-colors text-xs">
                Admin
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 w-full px-4 md:px-6 py-6">
          {children}
        </main>
        <footer className="border-t border-step-border py-4 text-center text-xs text-gray-400">
          Codelabs ISIS3710 &copy; {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
