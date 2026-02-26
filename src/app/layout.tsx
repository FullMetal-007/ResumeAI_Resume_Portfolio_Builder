import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AI Resume & Portfolio Builder",
    template: "%s | AI Resume & Portfolio Builder",
  },
  description:
    "Build ATS-optimized resumes and deploy stunning portfolios instantly with AI. Generate job-ready resumes and production-ready portfolio websites in minutes.",
  keywords: [
    "AI resume builder",
    "portfolio builder",
    "ATS resume",
    "AI career tools",
    "resume generator",
    "portfolio generator",
    "job application",
  ],
  authors: [{ name: "AI Resume & Portfolio Builder" }],
  creator: "AI Resume & Portfolio Builder",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "AI Resume & Portfolio Builder",
    description: "Build ATS-optimized resumes and deploy stunning portfolios instantly with AI.",
    siteName: "AI Resume & Portfolio Builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Resume & Portfolio Builder",
    description: "Build ATS-optimized resumes and deploy stunning portfolios instantly with AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextAuthProvider>
            {children}
            <Toaster
              position="top-center"
              richColors
              theme="dark"
              toastOptions={{
                className: "border-white/10 glass-solid shadow-2xl",
                style: {
                  background: "#12121a",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.1)",
                },
              }}
            />
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
