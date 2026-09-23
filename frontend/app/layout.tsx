import type React from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProductBrain V1 — Enterprise Product Intelligence Engine",
  description: "Autonomous Product Intelligence platform connecting Salesforce ARR, Zendesk Support logs, and Jira engineering execution."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <html lang="en" className="antialiased">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          />
        </head>
        <body className="font-sans antialiased bg-[#F7F5F3] text-[#37322F]">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
