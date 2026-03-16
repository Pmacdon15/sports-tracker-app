import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "./providers";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sports Equipment Tracker",
  description: "Track sports equipment rentals efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans`}
        >
          <Providers>
            <Suspense>
              <Navbar />
            </Suspense>
            <main className="flex-1 flex flex-col">
              {" "}
              <TooltipProvider>{children}</TooltipProvider>
            </main>
            <Toaster richColors position="bottom-right" />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
