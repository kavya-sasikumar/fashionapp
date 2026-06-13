import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { ClerkProvider, UserButton } from "@clerk/nextjs";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "FashionApp",
  description: "Your personal AI style assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${poppins.variable} ${playfair.variable} h-full`}>
        <body className="min-h-full flex flex-col bg-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
          <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-playfair)" }}>
              FashionApp
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-gray-500">
              <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
              <Link href="/events" className="hover:text-gray-900 transition-colors">Events</Link>
              <Link href="/fit" className="hover:text-gray-900 transition-colors">Find My Fit</Link>
              <Link href="/chat" className="hover:text-gray-900 transition-colors">Stylist Chat</Link>
              <Link href="/sign-in" className="hover:text-gray-900 transition-colors">Sign in</Link>
              <Link href="/signup" className="bg-[#6B2737] text-white px-4 py-1.5 rounded-full text-sm hover:bg-[#8B3A4A] transition-colors">Sign up</Link>
              <UserButton />
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="bg-white border-t border-gray-100 px-8 py-6 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} FashionApp &mdash; Powered by AI
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}