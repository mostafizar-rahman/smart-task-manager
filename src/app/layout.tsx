import type { Metadata } from "next";
import { Geist, } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { TaskProvider } from "@/context/taskContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Task Management",
  description: "Ai Task Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        suppressContentEditableWarning={true}
        className={`${geistSans.variable} antialiased`}
      >
        <TaskProvider>
          <Header />
          {children}
        </TaskProvider>
      </body>
    </html>
  );
}
