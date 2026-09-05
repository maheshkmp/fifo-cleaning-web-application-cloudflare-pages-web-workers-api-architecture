// Root layout — minimal shell.
// The [locale]/layout.tsx handles <html>, <body>, providers, and metadata.
// This file only exists to satisfy Next.js's requirement for a root layout.
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
