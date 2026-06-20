import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BuildingEmpiresShell from "@/components/BuildingEmpiresShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Building Empires",
  description: "Tools, content, profiles, and a future marketplace for builders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <BuildingEmpiresShell>{children}</BuildingEmpiresShell>
      </body>
    </html>
  );
}
