import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Product Passport Catalogue",
  description: "Schema-aware catalogue generated from an existing information-model export.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/">
            <span className="brand-mark">DPP</span>
            <span>Product Passport Catalogue</span>
          </Link>
          <nav><Link href="/">Catalogue</Link><Link href="/about">Data model</Link></nav>
        </header>
        <main>{children}</main>
        <footer>Digital Project Passport · Information-model driven catalogue</footer>
      </body>
    </html>
  );
}
