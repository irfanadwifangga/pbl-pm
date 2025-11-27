import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { InstallPWA } from "@/components/InstallPWA";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sistem Peminjaman Ruangan - Polinela",
    template: "%s | Polinela",
  },
  description:
    "Sistem manajemen peminjaman ruangan gedung Politeknik Negeri Lampung (Polinela). Platform digital untuk memudahkan proses peminjaman ruangan kampus.",
  keywords: [
    "peminjaman ruangan",
    "polinela",
    "politeknik negeri lampung",
    "booking ruangan",
    "manajemen ruangan",
  ],
  authors: [{ name: "Polinela" }],
  creator: "Politeknik Negeri Lampung",
  publisher: "Polinela",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://pbl-pm.vercel.app"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://pbl-pm.vercel.app",
    title: "Sistem Peminjaman Ruangan - Polinela",
    description: "Sistem manajemen peminjaman ruangan gedung Politeknik Negeri Lampung",
    siteName: "Peminjaman Ruangan Polinela",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistem Peminjaman Ruangan - Polinela",
    description: "Sistem manajemen peminjaman ruangan gedung Politeknik Negeri Lampung",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/assets/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/assets/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/assets/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/assets/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/assets/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/assets/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/assets/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/assets/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/assets/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/assets/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/assets/apple-icon-precomposed.png",
      },
    ],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className={inter.className}>
        {children}
        <InstallPWA />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
