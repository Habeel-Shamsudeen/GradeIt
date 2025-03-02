import type { Metadata } from "next";
import { Geist, Geist_Mono,Onest } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import NextTopLoader from 'nextjs-toploader';

const onest = Onest({ subsets: ['latin'] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GradeIt - Online Classroom & Coding Assignment Platform",
  description:
    "Empower learning, automate grading, and simplify coding assignments with our comprehensive platform for educators and students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
    className={`${onest.className} antialiased`}
    suppressHydrationWarning>
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader />
            {children}
          </ThemeProvider>
        
      </body>
    </html>
  );
}
