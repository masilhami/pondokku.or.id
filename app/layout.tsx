import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Menggunakan relative path ke LayoutWrapper
import LayoutWrapper from "../components/LayoutWrapper"; 

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// URL Domain Utama Web Pesantren
const siteUrl = "https://www.pondokku.or.id";

// METADATA UTAMA UNTUK SEO DAN SHARE SOSIAL MEDIA (OPEN GRAPH & TWITTER CARDS)
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pondok Pesantren Khoiro Ummah Salem Brebes - Portal Resmi",
    template: "%s | Ponpes Khoiro Ummah",
  },
  description: "Portal resmi Pondok Pesantren Khoiro Ummah, Desa Bentar, Kecamatan Salem, Kabupaten Brebes. Menyajikan berita terkini, program pendidikan, pendaftaran santri baru, dan kegiatan pesantren.",
  keywords: [
    "Pondok Pesantren Khoiro Ummah",
    "Ponpes Khoiro Ummah",
    "Khoiro Ummah Salem",
    "Khoiro Ummah Brebes",
    "Pondok Pesantren Salem Brebes",
    "Pesantren Bentar Salem",
    "Pondok Pesantren di Brebes"
  ],
  authors: [{ name: "Pondok Pesantren Khoiro Ummah" }],
  creator: "Pondok Pesantren Khoiro Ummah Salem Brebes",

  // KONFIGURASI OPEN GRAPH (WhatsApp, Facebook, Telegram, LinkedIn, dll)
  openGraph: {
    title: "Pondok Pesantren Khoiro Ummah Salem Brebes - Portal Resmi",
    description: "Portal resmi Pondok Pesantren Khoiro Ummah, Desa Bentar, Kecamatan Salem, Kabupaten Brebes. Informasi pendaftaran, kegiatan santri, dan pengumuman resmi.",
    url: siteUrl,
    siteName: "Pondok Pesantren Khoiro Ummah",
    images: [
      {
        url: "/images/banner.png", // Disesuaikan mengarah ke public/images/banner.png
        width: 1200,
        height: 630,
        alt: "Pondok Pesantren Khoiro Ummah Salem Brebes Banner",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  // KONFIGURASI TWITTER / X CARD
  twitter: {
    card: "summary_large_image",
    title: "Pondok Pesantren Khoiro Ummah Salem Brebes - Portal Resmi",
    description: "Portal resmi Pondok Pesantren Khoiro Ummah, Bentar, Salem, Brebes, Jawa Tengah.",
    images: ["/images/banner.png"],
  },

  // ICON WIDGET BROWSER
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 flex flex-col font-sans antialiased text-gray-900">
        
        {/* Membungkus struktur menggunakan LayoutWrapper */}
        <LayoutWrapper>
          {children}
        </LayoutWrapper>

      </body>
    </html>
  );
}