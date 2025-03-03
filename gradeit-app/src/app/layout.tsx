import type { Metadata } from "next";
import { Geist, Geist_Mono,Onest } from "next/font/google";
import "@/app/styles/globals.css";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import NextTopLoader from 'nextjs-toploader';

const onest = Onest({ subsets: ['latin'] });

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
      <body>
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
