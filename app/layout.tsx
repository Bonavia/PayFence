import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayFence · Payment review",
  description: "Review invoices, verify recipients, and bind approvals to payment details.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
