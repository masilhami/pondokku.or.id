import { FaYoutube, FaFacebook, FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  
  // =========================================================
  // TEMPAT EDIT LINK & TEKS (TINGGAL UBAH DI SINI)
  // =========================================================
  
  // 1. Edit Menu Jelajahi Situs (Kolom Tengah)
  const quickLinks = [
    { name: "Profil Pesantren", href: "/profil" },
    { name: "Visi & Misi", href: "/profil/visi-misi" },
    { name: "Ustaz & Pengasuh", href: "/guru-staf" },
    { name: "Galeri Kegiatan", href: "/galeri" },
    { name: "Pengumuman", href: "/pengumuman" },
    { name: "Media Islam", href: "https://onislam.web.id" },
    { name: "Prestasi Santri", href: "/prestasi" },
    { name: "Kontak Kami", href: "/kontak" }
  ];

  // 2. Edit Menu Informasi & Regulasi (Kolom Kanan)
  const infoLinks = [
    { name: "Tentang Kami", href: "/tentang-kami" },
    { name: "Susunan Redaksi", href: "/redaksi" },
    { name: "Kebijakan Privasi", href: "/kebijakan-privasi" },
    { name: "Peta Situs", href: "/sitemap" }
  ];

  // 3. Edit Link Sosial Media (Kolom Kiri)
  const socialLinks = [
    { icon: <FaYoutube />, href: "https://youtube.com", hoverColor: "hover:text-red-600" },
    { icon: <FaFacebook />, href: "https://facebook.com", hoverColor: "hover:text-blue-600" },
    { icon: <FaInstagram />, href: "https://instagram.com", hoverColor: "hover:text-pink-600" },
    { icon: <FaTwitter />, href: "https://twitter.com", hoverColor: "hover:text-gray-800" },
    { icon: <FaTiktok />, href: "https://tiktok.com", hoverColor: "hover:text-black" },
  ];

  return (
    <footer className="border-t border-gray-200 bg-white mt-12">
      {/* Kontainer Atas: Konten Utama Footer */}
      <div className="max-w-[1200px] mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Logo & Deskripsi Instansi Pesantren */}
        <div className="md:col-span-5 space-y-4">
          <img src="/images/logo-ponpes.png" alt="Logo Pondok Pesantren Khoiro Ummah" className="h-8 md:h-10" />
          <p className="text-xs text-gray-500 leading-relaxed max-w-[400px]">
            Portal berita dan informasi resmi Pondok Pesantren Khoiro Ummah. Alamat: Desa Bentar, Kecamatan Salem, Kabupaten Brebes, Jawa Tengah. Menyajikan kabar terkini seputar kegiatan pesantren, prestasi santri, program dakwah, dan pengumuman penting secara akurat.
          </p>
          
          {/* Sosial Media Resmi (Otomatis Loop) */}
          <div className="flex gap-4 text-gray-400 text-lg pt-2">
            {socialLinks.map((soc, idx) => (
              <a 
                key={idx} 
                href={soc.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`transition-colors ${soc.hoverColor}`}
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Kolom Tengah: Tautan Cepat / Jelajah Portal */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
            Jelajahi Situs
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            {quickLinks.map((link, idx) => (
              <Link key={idx} href={link.href} className="hover:text-[#0066ad] transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Informasi Tambahan & Kebijakan */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
            Informasi
          </h4>
          <div className="flex flex-col space-y-2 text-xs text-gray-500">
            {infoLinks.map((link, idx) => (
              <Link key={idx} href={link.href} className="hover:text-[#0066ad] transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Kontainer Bawah: Hak Cipta Resmi */}
      <div className="bg-gray-50 border-t border-gray-100 py-4">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
          <p>© 2026 Pondok Pesantren Khoiro Ummah Salem Brebes. All Rights Reserved.</p>
          <p>www.pondokku.or.id - Portal Informasi & Kabar Edukasi Pesantren.</p>
        </div>
      </div>
    </footer>
  );
}