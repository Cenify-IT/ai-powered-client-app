import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import AppProviders from "./context/AppProviders";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cenify IT | Web Development Solutions for Modern Businesses",
  description:
    "Cenify IT builds fast, custom-coded websites for solopreneurs, therapists, coaches, consultants, and small businesses. Launch faster, attract more clients, and grow your business online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} antialiased flex flex-col min-h-screen`}
      >
        <AppProviders>
          <Toaster position="top-right" />
          <main className="flex-1">{children}</main> {/* Page content */}
          <Footer /> {/* Global footer */}
        </AppProviders>
      </body>
    </html>
  );
}
