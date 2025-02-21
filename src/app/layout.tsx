import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider"
import WalletContextProvider from "@/components/WalletContext/WalletContextProvider";
import { Toaster } from "react-hot-toast";

import "./globals.css";
import { Header } from "@/components/Header/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solscam",
  description: "A voting platform for the Solana community",
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
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class">
          <WalletContextProvider>
            <Toaster />
            <div className="px-10">
              <Header />
              {children}
            </div>
          </WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
