import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Matiks - Speed Math Battle Arena",
  description: "Real-time 1v1 speed math competition platform built with Next.js and Shadcn UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#080c14] text-slate-100 font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
