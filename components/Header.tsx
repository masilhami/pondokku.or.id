'use client';

import { useRef, useEffect, useState } from 'react';
import { 
  FaSearch, FaYoutube, FaFacebook, FaInstagram, FaTwitter, FaTiktok, 
  FaRegUser, FaAngleLeft, FaAngleRight, FaTimes, FaHome, FaUniversity, 
  FaBullhorn, FaBookOpen, FaImages, FaPhoneAlt, FaCalendarAlt, FaAward, FaChevronRight 
} from 'react-icons/fa';
import { HiOutlineNewspaper, HiMenu } from 'react-icons/hi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { client, urlFor } from "@/lib/sanity";

function getSanityImageUrl(imageSource: any): string | null {
  if (!imageSource || !imageSource.asset || !imageSource.asset._ref) return null;
  try {
    return urlFor(imageSource).url();
  } catch {
    return null;
  }
}

function getTodayIndonesianDate() {
  const now = new Date();
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  return {
    line1: `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`,
    line2: `${now.getFullYear()}`
  };
}

export default function Header() {
  const date = getTodayIndonesianDate();
  const router = useRouter();
  
  const [midBannerData, setMidBannerData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const categoriesRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // =========================================================
  // DATA LINK BARIS MENU UTAMA DENGAN IKON UNTUK MOBILE DRAWER
  // =========================================================
  const categories = [
    { name: "Beranda", href: "/", icon: <FaHome /> },
    { name: "Profil Pesantren", href: "/profil", icon: <FaUniversity /> },
    { name: "Visi & Misi", href: "/profil/visi-misi", icon: <FaUniversity /> },
    { name: "Ustaz & Pengasuh", href: "/guru-staf", icon: <FaRegUser /> },
    { name: "Prestasi Santri", href: "/prestasi", icon: <FaAward /> },
    { name: "Pengumuman", href: "/search?category=pengumuman", icon: <FaBullhorn /> },
    { name: "Kajian & Edukasi", href: "/search?category=edukasi", icon: <FaBookOpen /> },
    { name: "Galeri Kegiatan", href: "/galeri", icon: <FaImages /> },
    { name: "Kontak Kami", href: "/kontak", icon: <FaPhoneAlt /> }
  ];
  
  // =========================================================
  // DATA LINK BARIS KILAS WARTA / FITUR CEPAT
  // =========================================================
  const kilasDaerah = [
    { name: "Tahfidzul Qur'an", href: "/search?q=tahfidz" },
    { name: "Pendaftaran Santri Baru (PSB)", href: "/search?q=psb" },
    { name: "Dirasah Islamiyah", href: "/search?q=dirasah" },
    { name: "Kajian Sunnah", href: "/search?q=kajian" },
    { name: "Info Salem & Brebes", href: "/search?q=brebes" }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    async function fetchBanner() {
      try {
        const data = await client.fetch(`*[_type == "iklan" && (placement == "mid-banner" || placement == "drafts.mid-banner")][0] {
          title,
          image,
          linkUrl
        }`);
        setMidBannerData(data);
      } catch (error) {
        console.error("Gagal mengambil data banner atas:", error);
      }
    }
    fetchBanner();
  }, []);

  const bannerImgSrc = getSanityImageUrl(midBannerData?.image);

  const executeScroll = (direction: 'left' | 'right') => {
    const step = 8;
    if (categoriesRef.current) {
      if (direction === 'right') {
        categoriesRef.current.scrollLeft += step;
      } else {
        categoriesRef.current.scrollLeft -= step;
      }
    }
  };

  const startScrolling = (direction: 'left' | 'right') => {
    if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    executeScroll(direction);
    scrollIntervalRef.current = setInterval(() => executeScroll(direction), 10);
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const hideScrollbarStyle = {
    msOverflowStyle: 'none' as const,
    scrollbarWidth: 'none' as const,
    WebkitOverflowScrolling: 'touch' as const,
  };

  return (
    <>
      {/* =========================================================
          BARIS 1: HEADER UTAMA (STICKY TOP SEPANJANG SCROLL HALAMAN)
          ========================================================= */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs select-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-2.5 max-w-[1200px] mx-auto gap-2 md:gap-4">
          
          {/* AREA LOGO & HAMBURGER */}
          <div className="flex items-center justify-between md:justify-start gap-4 md:gap-5 w-full md:w-auto shrink-0">
            <div className="flex items-center gap-3">
              {/* Tombol Hamburger Aktif untuk Mobile */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-2xl text-gray-700 hover:text-[#0066ad] md:hidden focus:outline-none p-1 rounded-md active:bg-gray-100 transition-colors"
                aria-label="Buka Menu"
              >
                <HiMenu />
              </button>
              
              <Link href="/" className="flex items-center hover:opacity-95 transition-opacity">
                <img 
                  src="/images/logo-ponpes.png" 
                  alt="Logo Pondok Pesantren Khoiro Ummah" 
                  className="h-11 sm:h-12 md:h-13 lg:h-14 w-auto max-w-[240px] sm:max-w-[280px] md:max-w-[320px] object-contain cursor-pointer" 
                />
              </Link>
            </div>
            
            <div className="text-[11px] md:text-xs text-gray-400 font-medium leading-tight hidden xl:block border-l border-gray-300 pl-4 py-0.5 font-sans">
              {date.line1}<br />{date.line2}
            </div>

            {/* Icon User Mobile -> Menuju https://pondokku.or.id/studio */}
            <a 
              href="https://pondokku.or.id/studio"
              className="text-xl text-gray-600 hover:text-[#0066ad] transition-colors p-1.5 rounded-full hover:bg-gray-100 md:hidden"
              title="Studio Sanity"
            >
              <FaRegUser />
            </a>
          </div>
          
          {/* AREA PENCARIAN */}
          <div className="w-full md:w-[220px] lg:w-[260px] shrink-0">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari info pesantren..." 
                className="border border-gray-300 rounded-full py-1.5 pl-4 pr-9 text-xs w-full outline-none bg-gray-50 focus:bg-white focus:border-[#0066ad] transition-all shadow-2xs" 
              />
              <button 
                type="submit" 
                className="absolute right-3 top-2 text-gray-400 text-xs hover:text-[#0066ad] transition-colors"
                aria-label="Cari"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* AREA SOSIAL MEDIA & USER DESKTOP */}
          <div className="hidden md:flex items-center justify-end gap-3 lg:gap-4 text-gray-500 text-base shrink-0">
            <div className="flex gap-3 text-gray-400 text-lg">
              <a href="#" className="hover:text-red-600 cursor-pointer transition-colors"><FaYoutube /></a> 
              <a href="#" className="hover:text-blue-600 cursor-pointer transition-colors"><FaFacebook /></a> 
              <a href="#" className="hover:text-pink-600 cursor-pointer transition-colors"><FaInstagram /></a> 
              <a href="#" className="hover:text-gray-800 cursor-pointer transition-colors"><FaTwitter /></a> 
              <a href="#" className="hover:text-blue-500 cursor-pointer transition-colors"><HiOutlineNewspaper /></a> 
              <a href="#" className="hover:text-black cursor-pointer transition-colors"><FaTiktok /></a>
            </div>
            
            <div className="border-l border-gray-200 pl-3">
              <a 
                href="https://pondokku.or.id/studio"
                className="text-lg cursor-pointer text-gray-500 hover:text-[#0066ad] transition-colors block"
                title="Studio Sanity"
              >
                <FaRegUser />
              </a>
            </div>
          </div>

        </div>
      </header>

      {/* =========================================================
          DRAWER MENU MOBILE MODERN & ELEGANT
          ========================================================= */}
      <div 
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop gelap blur */}
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Konten Menu Samping Slide-in */}
        <div 
          className={`relative w-[300px] max-w-[85%] bg-white h-full shadow-2xl z-10 flex flex-col justify-between transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header Drawer dengan Gradien */}
          <div className="bg-gradient-to-r from-[#004b80] to-[#0066ad] p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] tracking-widest uppercase font-bold text-blue-200">PORTAL RESMI</span>
                <h3 className="font-extrabold text-sm tracking-tight text-white">Khoiro Ummah Salem</h3>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Tutup Menu"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          </div>

          {/* Body Menu Utama */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            
            {/* Navigasi Utama */}
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block px-2 mb-2">
                Navigasi Utama
              </span>
              <div className="space-y-1">
                {categories.map((cat, idx) => (
                  <Link 
                    key={idx} 
                    href={cat.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:text-[#0066ad] hover:bg-blue-50/70 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 group-hover:text-[#0066ad] transition-colors text-sm">
                        {cat.icon}
                      </span>
                      <span>{cat.name}</span>
                    </div>
                    <FaChevronRight className="text-[10px] text-gray-300 group-hover:text-[#0066ad] transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
                
                <Link 
                  href="/agenda"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:text-[#0066ad] hover:bg-blue-50/70 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 group-hover:text-[#0066ad] transition-colors text-sm">
                      <FaCalendarAlt />
                    </span>
                    <span>Agenda Pesantren</span>
                  </div>
                  <FaChevronRight className="text-[10px] text-gray-300 group-hover:text-[#0066ad]" />
                </Link>
              </div>
            </div>

            {/* Quick Links Kilas */}
            <div className="border-t border-gray-100 pt-3">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block px-2 mb-2">
                Kilas Topik
              </span>
              <div className="flex flex-wrap gap-1.5 px-1">
                {kilasDaerah.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[11px] font-medium bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-[#0066ad] px-2.5 py-1 rounded-full transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Drawer */}
          <div className="p-4 bg-slate-50 border-t border-gray-100 space-y-3">
            <a 
              href="https://pondokku.or.id/studio"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#0066ad] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#004f87] transition-all"
            >
              <FaRegUser className="text-xs" /> Masuk Studio Pesantren
            </a>
            
            {/* Social media icons di footer mobile drawer */}
            <div className="flex items-center justify-center gap-4 text-gray-400 text-base pt-1">
              <a href="#" className="hover:text-red-600 transition-colors"><FaYoutube /></a>
              <a href="#" className="hover:text-blue-600 transition-colors"><FaFacebook /></a>
              <a href="#" className="hover:text-pink-600 transition-colors"><FaInstagram /></a>
              <a href="#" className="hover:text-gray-800 transition-colors"><FaTwitter /></a>
              <a href="#" className="hover:text-black transition-colors"><FaTiktok /></a>
            </div>
            
            <div className="text-center text-[10px] text-gray-400 font-medium">
              www.pondokku.or.id • Salem, Brebes
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          BARIS 2: SLOT MEGA BANNER IKLAN (TERSEMBUNYI TOTAL DI MOBILE)
          ========================================================= */}
      <div className="w-full bg-slate-100/60 border-b border-gray-200 py-6 select-none hidden md:block">
        <div className="max-w-[1200px] w-full mx-auto flex justify-center px-4">
          {midBannerData && bannerImgSrc ? (
            <div className="w-full bg-white p-2 md:p-2.5 rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.18)] transition-all duration-300">
              <a 
                href={midBannerData.linkUrl || "#"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-full max-h-[140px] overflow-hidden rounded-xl relative group"
              >
                <img 
                  src={bannerImgSrc} 
                  alt="Top Banner" 
                  className="w-full h-auto object-cover object-center max-h-[140px] group-hover:scale-[1.01] transition-transform duration-300" 
                />
                <span className="absolute top-2 right-2 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-xs">
                  Ads
                </span>
              </a>
            </div>
          ) : (
            <div className="w-full bg-white p-2 md:p-2.5 rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
              <div className="w-full h-[90px] md:h-[120px] bg-slate-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 text-xs font-sans">
                <span className="font-bold tracking-wider text-[10px] text-gray-400">RUANG INFORMASI PENGUMUMAN UTAMA PESANTREN</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          BARIS 3: NAVIGASI KATEGORI UTAMA (DESKTOP)
          ========================================================= */}
      <nav className="w-full bg-white border-b border-gray-200 hidden md:block select-none">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-11 relative">
          
          {/* Logo Aksen Inisial Pesantren */}
          <div className="flex items-center gap-2 font-black text-[#0066ad] text-base italic cursor-pointer select-none shrink-0 pr-4">
            <span>KU</span>
          </div>
          
          {/* Loop Menu Utama */}
          <div 
            ref={categoriesRef}
            style={hideScrollbarStyle}
            className="flex-1 flex gap-7 items-center overflow-x-auto h-full text-xs font-bold text-gray-600 [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((cat, index) => (
              <Link 
                key={index} 
                href={cat.href} 
                className="hover:text-[#0066ad] cursor-pointer whitespace-nowrap tracking-wide py-3 border-b-2 border-b-transparent hover:border-b-[#0066ad] transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1.5 pl-4 shrink-0 bg-white shadow-[-20px_0_20px_5px_#fff] z-10 h-full text-gray-400 select-none">
            <Link href="/agenda" className="text-[11px] font-bold text-gray-500 mr-2 cursor-pointer hover:text-[#0066ad]">
              Agenda
            </Link>
            
            <button 
              onMouseDown={() => startScrolling('left')}
              onMouseUp={stopScrolling}
              onMouseLeave={stopScrolling}
              className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:text-[#0066ad] active:scale-95 transition-all cursor-pointer"
              aria-label="Geser Kiri"
            >
              <FaAngleLeft className="text-[10px]" />
            </button>
            <button 
              onMouseDown={() => startScrolling('right')}
              onMouseUp={stopScrolling}
              onMouseLeave={stopScrolling}
              className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:text-[#0066ad] active:scale-95 transition-all cursor-pointer"
              aria-label="Geser Kanan"
            >
              <FaAngleRight className="text-[10px]" />
            </button>
          </div>
        </div>
      </nav>

      {/* =========================================================
          LAPISAN B: Jalur Teks KILAS Berita Pesantren
          ========================================================= */}
      <div className="w-full bg-white border-b border-gray-200 hidden md:block select-none">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center h-8 text-[11px] font-sans tracking-wide py-1 relative">
          <span className="font-extrabold text-gray-800 uppercase shrink-0 mr-4 border-r border-gray-300 pr-4 z-10 bg-white">KILAS</span>
          
          {/* Loop Menu Sub-Kilas */}
          <div 
            style={hideScrollbarStyle}
            className="flex-1 flex gap-5 text-gray-600 items-center font-medium overflow-x-auto [&::-webkit-scrollbar]:hidden"
          >
            {kilasDaerah.map((item, idx) => (
              <Link key={idx} href={item.href} className="hover:text-[#0066ad] cursor-pointer whitespace-nowrap transition-colors">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}