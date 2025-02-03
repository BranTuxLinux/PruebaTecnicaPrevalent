import type { Metadata } from "next";
import "./globals.css";
import { ApolloWrapper } from "@/lib/gpl-wrapper";
import { Navigation } from "@/components/template/sidebar";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { HeaderComponent } from "@/components/template/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FSM",
  description: "Financial Management System",
  icons: "/file.svg",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} `}>
        <HeaderComponent />
        <div className="h-screen flex flex-col md:flex-row bg-background text-foreground items-center ">
          <SessionProvider>
          <Navigation />
            <ApolloWrapper>{children}</ApolloWrapper>
          </SessionProvider>
          <Toaster />
        </div>
        <footer className="bg-secondary py-4 text-center text-secondary-foreground">
          <p>Brandon Quintero 2025</p>
        </footer>
      </body>
    </html>
  );
}
