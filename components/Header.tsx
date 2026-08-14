'use client';

import { useRef, useEffect, useState } from 'react';
import { FaSearch, FaYoutube, FaFacebook, FaInstagram, FaTwitter, FaTiktok, FaRegUser, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
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
  
  const categoriesRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // =========================================================
  // DATA LINK BARIS MENU UTAMA (KATEGORI)
  // =========================================================
  const [categories, setCategories] = useState([
    { name: "Beranda", href: "/" },
    { name: "Profil Pesantren", href: "/profil" },
    { name: "Visi & Misi", href: "/profil/visi-misi" },
    { name: "Ustaz & Pengasuh", href: "/guru-staf" },
    { name: "Prestasi Santri", href: "/prestasi" },
    { name: "Pengumuman", href: "/search?category=pengumuman" },
    { name: "Kajian & Edukasi", href: "/search?category=edukasi" },
    { name: "Galeri Kegiatan", href: "/galeri" },
    { name: "Kontak Kami", href: "/kontak" }
  ]);
  
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
        if (categoriesRef.current.scrollLeft >= categoriesRef.current.scrollWidth - categoriesRef.current.clientWidth - 50) {
          setCategories((prev) => [...prev.slice(1), prev[0]]);
          categoriesRef.current.scrollLeft -= 100;
        }
      } else {
        categoriesRef.current.scrollLeft -= step;
        if (categoriesRef.current.scrollLeft <= 10) {
          setCategories((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
          categoriesRef.current.scrollLeft += 100;
        }
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
    <header className="w-full bg-white select-none relative">
      
      {/* BARIS 1: HEADER UTAMA (STICKY SAMPAI AKHIR SCROLL) */}
      <div className="w-full border-b border-gray-100 bg-white sticky top-0 z-50 shadow-xs py-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-1.5 max-w-[1200px] mx-auto gap-3 md:gap-4">
          
          {/* AREA LOGO (UKURAN DIPROPORSIONALKAN SEDIKIT LEBIH RAMPING) */}
          <div className="flex items-center justify-between md:justify-start gap-4 md:gap-5 w-full md:w-auto shrink-0">
            <div className="flex items-center gap-3">
              <HiMenu className="text-2xl text-gray-700 cursor-pointer md:hidden" />
              <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
                <img 
                  src="/images/logo-ponpes.png" 
                  alt="Logo Pondok Pesantren Khoiro Ummah" 
                  className="h-9 sm:h-11 md:h-12 lg:h-14 w-auto max-w-[200px] sm:max-w-[240px] md:max-w-[290px] object-contain cursor-pointer" 
                />
              </Link>
            </div>
            <div className="text-[11px] md:text-xs text-gray-400 font-medium leading-tight hidden xl:block border-l border-gray-300 pl-4 py-0.5 font-sans">
              {date.line1}<br />{date.line2}
            </div>
            <FaRegUser className="text-xl text-gray-600 cursor-pointer md:hidden" />
          </div>
          
          {/* AREA PENCARIAN */}
          <div className="w-full md:w-[220px] lg:w-[280px] shrink-0">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari info pesantren..." 
                className="border border-gray-300 rounded-full py-1.5 pl-4 pr-9 text-xs w-full outline-none bg-gray-50/70 focus:bg-white focus:border-[#0066ad] transition-all" 
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

          {/* AREA SOSIAL MEDIA */}
          <div className="hidden md:flex items-center justify-end gap-4 lg:gap-5 text-gray-500 text-base shrink-0">
            <div className="flex gap-3 lg:gap-4 text-gray-400 text-lg">
              <a href="#" className="hover:text-red-600 cursor-pointer transition-colors"><FaYoutube /></a> 
              <a href="#" className="hover:text-blue-600 cursor-pointer transition-colors"><FaFacebook /></a> 
              <a href="#" className="hover:text-pink-600 cursor-pointer transition-colors"><FaInstagram /></a> 
              <a href="#" className="hover:text-gray-800 cursor-pointer transition-colors"><FaTwitter /></a> 
              <a href="#" className="hover:text-blue-500 cursor-pointer transition-colors"><HiOutlineNewspaper /></a> 
              <a href="#" className="hover:text-black cursor-pointer transition-colors"><FaTiktok /></a>
            </div>
            <div className="border-l border-gray-200 pl-3">
              <FaRegUser className="text-lg cursor-pointer text-gray-500 hover:text-gray-800 transition-colors" />
            </div>
          </div>

        </div>
      </div>

      {/* BARIS 2: SLOT MEGA BANNER IKLAN */}
      <div className="w-full bg-slate-100/60 border-b border-gray-200 py-6">
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

      {/* BARIS 3: NAVIGASI KATEGORI UTAMA */}
      <div className="w-full bg-white border-b border-gray-200 hidden md:block">
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
      </div>

      {/* LAPISAN B: Jalur Teks KILAS Berita Pesantren */}
      <div className="w-full bg-white border-b border-gray-200 hidden md:block">
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

    </header>
  );
}