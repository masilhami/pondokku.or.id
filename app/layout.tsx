// app/layout.tsx

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper";

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

const siteUrl = "https://www.pondokku.or.id";
const siteName = "Pondok Pesantren Khoiro Ummah";
const siteTitle =
  "Pondok Pesantren Khoiro Ummah Salem Brebes - Portal Resmi";

const siteDescription =
  "Portal resmi Pondok Pesantren Khoiro Ummah, Desa Bentar, " +
  "Kecamatan Salem, Kabupaten Brebes. Menyajikan berita terkini, " +
  "program pendidikan, pendaftaran santri baru, dan kegiatan pesantren.";

// File harus tersedia di public/images/banner.png.
const defaultShareImage = new URL(
  "/images/banner.png",
  siteUrl
).href;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  applicationName: siteName,

  title: {
    default: siteTitle,
    template: "%s | Ponpes Khoiro Ummah",
  },

  description: siteDescription,

  keywords: [
    "Pondok Pesantren Khoiro Ummah",
    "Ponpes Khoiro Ummah",
    "Khoiro Ummah Salem",
    "Khoiro Ummah Brebes",
    "Pondok Pesantren Salem Brebes",
    "Pesantren Bentar Salem",
    "Pondok Pesantren di Brebes",
  ],

  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,

    images: [
      {
        url: defaultShareImage,
        alt: "Pondok Pesantren Khoiro Ummah Salem Brebes",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [defaultShareImage],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-gray-50 flex flex-col font-sans antialiased text-gray-900">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}