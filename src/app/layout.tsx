import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { ChatWidgetLazy } from "@/components/chat/ChatWidgetLazy";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Milind Prabhakar — Senior Software Engineer",
    template: "%s | Milind Prabhakar",
  },
  description:
    "Senior Software Engineer with 8+ years building enterprise-grade systems in financial services. Currently at Capital One.",
  openGraph: {
    title: "Milind Prabhakar — Senior Software Engineer",
    description:
      "Senior Software Engineer with 8+ years building enterprise-grade systems in financial services.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Header />
        <main className="min-h-screen pt-14">{children}</main>
        <Footer />
        <ChatWidgetLazy />
        <GrainOverlay />
        <Analytics />
      </body>
    </html>
  );
}
