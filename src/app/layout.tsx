// File: src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import LayoutLoaderWrapper from "./LayoutLoaderWrapper";
import { headers } from "next/headers"; // <--- import headers
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
  title: "Jubilee Care ICT Innovations and Consult",
  description: "NIMC FEP",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutLoaderWrapper>{children}</LayoutLoaderWrapper>
        <Toaster position="top-right" />
      </body>
    </html>

  );
  
}
