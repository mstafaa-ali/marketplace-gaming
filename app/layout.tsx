import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GameVault — Top Up, Voucher & Akun Game Terpercaya",
    template: "%s | GameVault",
  },
  description:
    "Marketplace digital untuk top up, voucher, dan akun game premium dengan garansi anti-minus dan proses instan.",
  applicationName: "GameVault",
  keywords: [
    "top up game",
    "voucher game",
    "akun game",
    "mobile legends",
    "valorant",
    "pubg mobile",
    "genshin impact",
    "free fire",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "GameVault",
    title: "GameVault — Top Up, Voucher & Akun Game Terpercaya",
    description:
      "Marketplace digital untuk top up, voucher, dan akun game premium dengan garansi anti-minus.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0717" },
    { media: "(prefers-color-scheme: light)", color: "#F8F5FF" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-fg">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
          >
            Lewati ke konten utama
          </a>
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
