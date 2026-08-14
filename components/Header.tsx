'use client';

import { useRef, useEffect, useState } from 'react';
import { 
  FaSearch, FaYoutube, FaFacebook, FaInstagram, FaTwitter, FaTiktok, 
  FaRegUser, FaAngleLeft, FaAngleRight, FaTimes, FaHome, FaUniversity, 
  FaBullhorn, FaBookOpen, FaImages, FaPhoneAlt, FaCalendarAlt, FaAward, FaChevronRight 
} from 'react-icons/fa';
import { HiOutlineNewspaper, HiMenuAlt1 } from 'react-icons/hi';
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
  // DATA LINK BARIS MENU UTAMA
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
    { name: "Pendaftaran PSB", href: "/search?q=psb" },
    { name: "Dirasah Islamiyah", href: "/search?q=dirasah" },
    { name: "Kajian Sunnah", href: "/search?q=kajian" },
    { name: "Salem & Brebes", href: "/search?q=brebes" }
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
          BARIS 1: HEADER UTAMA (STICKY TOP DENGAN DESAIN MODERN)
          ========================================================= */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-[0_2px_15px_rgba(0,0,0,0.04)] select-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between px-3 sm:px-5 py-2 md:py-2.5 max-w-[1200px] mx-auto gap-2 md:gap-4">
          
          {/* BARIS UTAMA MOBILE & DESKTOP BRANDING */}
          <div className="flex items-center justify-between w-full md:w-auto md:justify-start gap-2 sm:gap-4 shrink-0">
            
            {/* Tombol Hamburger Mobile Bergaya Modern Soft-Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-[#0066ad] bg-slate-100/80 hover:bg-blue-50 active:scale-95 md:hidden rounded-xl transition-all shadow-2xs shrink-0"
              aria-label="Buka Menu"
            >
              <HiMenuAlt1 className="text-xl" />
            </button>
            
            {/* Logo Utama: Dibuat tegas, proporsional, dan mengisi area header */}
            <Link 
              href="/" 
              className="flex-1 md:flex-initial flex items-center justify-center md:justify-start px-2 hover:opacity-90 transition-opacity"
            >
              <img 
                src="/images/logo-ponpes.png" 
                alt="Logo Pondok Pesantren Khoiro Ummah" 
                className="h-11 sm:h-12 md:h-12 lg:h-13 w-auto max-w-[240px] sm:max-w-[300px] md:max-w-[320px] object-contain cursor-pointer drop-shadow-2xs" 
              />
            </Link>
            
            {/* Tanggal Hari Ini (Desktop View) */}
            <div className="text-[11px] md:text-xs text-slate-400 font-medium leading-tight hidden xl:block border-l border-slate-200 pl-4 py-0.5 font-sans">
              {date.line1}<br />{date.line2}
            </div>

            {/* Icon User Mobile: Tautan ke Studio */}
            <a 
              href="https://pondokku.or.id/studio"
              className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-[#0066ad] bg-slate-100/80 hover:bg-blue-50 active:scale-95 rounded-xl transition-all md:hidden shrink-0 shadow-2xs"
              title="Studio Sanity"
            >
              <FaRegUser className="text-sm" />
            </a>
          </div>
          
          {/* SEARCH BAR (MODERN CAPSULE STYLE) */}
          <div className="w-full md:w-[230px] lg:w-[280px] shrink-0">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari info pesantren..." 
                className="border border-slate-200/90 rounded-full py-1.5 md:py-2 pl-4 pr-10 text-xs w-full outline-none bg-slate-50/70 focus:bg-white focus:border-[#0066ad] focus:ring-2 focus:ring-[#0066ad]/10 transition-all text-slate-700 placeholder:text-slate-400" 
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0066ad] text-xs transition-colors p-1"
                aria-label="Cari"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* SOSIAL MEDIA & STUDIO LINK (DESKTOP ONLY) */}
          <div className="hidden md:flex items-center justify-end gap-3 lg:gap-4 text-slate-500 text-base shrink-0">
            <div className="flex gap-3 text-slate-400 text-lg">
              <a href="#" className="hover:text-red-600 transition-colors"><FaYoutube /></a> 
              <a href="#" className="hover:text-blue-600 transition-colors"><FaFacebook /></a> 
              <a href="#" className="hover:text-pink-600 transition-colors"><FaInstagram /></a> 
              <a href="#" className="hover:text-gray-800 transition-colors"><FaTwitter /></a> 
              <a href="#" className="hover:text-blue-500 transition-colors"><HiOutlineNewspaper /></a> 
              <a href="#" className="hover:text-black transition-colors"><FaTiktok /></a>
            </div>
            
            <div className="border-l border-slate-200 pl-3">
              <a 
                href="https://pondokku.or.id/studio"
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0066ad] bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-all border border-slate-200/60"
                title="Studio Sanity"
              >
                <FaRegUser className="text-[11px]" />
                <span>Studio</span>
              </a>
            </div>
          </div>

        </div>

        {/* Akses Cepat Kilas Mini (Khusus Tampilan Mobile di Bawah Search) */}
        <div className="md:hidden w-full border-t border-slate-100 bg-slate-50/50 py-1.5 px-3 overflow-x-auto" style={hideScrollbarStyle}>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[9px] font-black tracking-wider uppercase bg-[#0066ad] text-white px-2 py-0.5 rounded-md shrink-0">
              KILAS
            </span>
            {kilasDaerah.map((item, idx) => (
              <Link 
                key={idx} 
                href={item.href} 
                className="text-[10px] font-semibold text-slate-600 hover:text-[#0066ad] bg-white border border-slate-200/80 px-2.5 py-0.5 rounded-full shadow-3xs"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* =========================================================
          DRAWER MENU MOBILE DENGAN DESAIN MODERN & ELEGAN
          ========================================================= */}
      <div 
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop Dark Blur */}
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Konten Menu Samping Sliding Drawer */}
        <div 
          className={`relative w-[310px] max-w-[85%] bg-white h-full shadow-[0_0_50px_rgba(0,0,0,0.2)] z-10 flex flex-col justify-between transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header Drawer Bergaya Card Gradient */}
          <div className="p-5 bg-gradient-to-br from-[#003861] via-[#004f85] to-[#0066ad] text-white relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
              <FaUniversity className="text-8xl" />
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  PORTAL RESMI
                </span>
                <h3 className="font-black text-base tracking-tight leading-tight mt-1 text-white">
                  Khoiro Ummah Salem
                </h3>
                <p className="text-[11px] text-blue-100/80 font-medium">
                  Bentar, Salem, Brebes, Jawa Tengah
                </p>
              </div>
              
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 active:scale-90 flex items-center justify-center text-white transition-all shrink-0"
                aria-label="Tutup Menu"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
          </div>

          {/* Body Menu Utama */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5" style={hideScrollbarStyle}>
            
            {/* List Navigasi Utama */}
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block px-2 mb-2">
                Menu Utama
              </span>
              <div className="space-y-1">
                {categories.map((cat, idx) => (
                  <Link 
                    key={idx} 
                    href={cat.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#0066ad] hover:bg-blue-50/80 active:bg-blue-100/70 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 group-hover:text-[#0066ad] text-sm transition-colors">
                        {cat.icon}
                      </span>
                      <span>{cat.name}</span>
                    </div>
                    <FaChevronRight className="text-[10px] text-slate-300 group-hover:text-[#0066ad] transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
                
                <Link 
                  href="/agenda"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#0066ad] hover:bg-blue-50/80 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 group-hover:text-[#0066ad] text-sm transition-colors">
                      <FaCalendarAlt />
                    </span>
                    <span>Agenda Pesantren</span>
                  </div>
                  <FaChevronRight className="text-[10px] text-slate-300 group-hover:text-[#0066ad]" />
                </Link>
              </div>
            </div>

            {/* List Kilas Warta */}
            <div className="border-t border-slate-100 pt-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block px-2 mb-2">
                Kategori Cepat
              </span>
              <div className="flex flex-wrap gap-1.5 px-1">
                {kilasDaerah.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[11px] font-semibold bg-slate-100 hover:bg-blue-100 hover:text-[#0066ad] text-slate-600 px-3 py-1 rounded-lg transition-colors shadow-3xs"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Drawer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
            <a 
              href="https://pondokku.or.id/studio"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-[#0066ad] to-[#004b80] text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg active:scale-98 transition-all"
            >
              <FaRegUser className="text-xs" /> Masuk Studio Pesantren
            </a>
            
            {/* Sosmed Icon Drawer */}
            <div className="flex items-center justify-center gap-4 text-slate-400 text-base pt-1">
              <a href="#" className="hover:text-red-600 transition-colors"><FaYoutube /></a>
              <a href="#" className="hover:text-blue-600 transition-colors"><FaFacebook /></a>
              <a href="#" className="hover:text-pink-600 transition-colors"><FaInstagram /></a>
              <a href="#" className="hover:text-slate-800 transition-colors"><FaTwitter /></a>
              <a href="#" className="hover:text-black transition-colors"><FaTiktok /></a>
            </div>
            
            <div className="text-center text-[10px] text-slate-400 font-medium">
              www.pondokku.or.id • Khoiro Ummah Salem
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          BARIS 2: SLOT MEGA BANNER IKLAN (HIDDEN DI MOBILE)
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
          BARIS 3: NAVIGASI KATEGORI UTAMA (DESKTOP VIEW)
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
          LAPISAN B: Jalur Teks KILAS Berita Pesantren (DESKTOP)
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