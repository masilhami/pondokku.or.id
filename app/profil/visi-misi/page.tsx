import React from 'react';

export default function VisiMisiPage() {
  // Menyesuaikan detail misi agar sejalan dengan poin Visi Pondok Pesantren Khoiro Ummah
  const misiItems = [
    { title: "Ketaqwaan & Akhlak Mulia", desc: "Menanamkan akidah Islamiyyah yang lurus, akhlakul karimah, serta nilai-nilai Al-Qur'an dan As-Sunnah dalam kehidupan sehari-hari." },
    { title: "Tahfidz & Ulumuddin", desc: "Menyelenggarakan program tahfidzul Qur'an yang terstruktur dan pembelajaran ilmu-ilmu syar'i untuk mencetak generasi Rabbani." },
    { title: "Kemandirian & Kepemimpinan", desc: "Membentuk karakter santri yang mandiri, disiplin, berjiwa kepemimpinan, dan siap mengabdi kepada masyarakat." },
    { title: "Sinergi & Berprestasi", desc: "Mengembangkan potensi keilmuan, bahasa, serta keterampilan santri secara unggul dan bersinergi bersama wali santri & masyarakat." }
  ];

  return (
    // Mengunci induk kontainer terluar agar tetap sejajar di koridor web
    <div className="w-full max-w-[1200px] mx-auto px-4 font-sans text-gray-800 mt-6 min-h-screen">
      
      {/* =========================================================
          HERO HEADER: MODERN FUTURISTIC GRADIENT
          ========================================================= */}
      <div className="w-full bg-linear-to-br from-[#001f3f] via-[#004b80] to-[#0066ad] py-14 text-white text-center rounded-2xl shadow-md relative overflow-hidden">
        {/* Dekorasi Aksen Pola Geometris Khas Teknologi/Masa Depan */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="w-full px-4 relative z-10">
          <span className="text-[10px] uppercase tracking-widest bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full font-bold border border-blue-400/20 backdrop-blur-xs">
            Rencana Strategis
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-3">Visi & Misi</h1>
          <p className="text-xs md:text-sm text-blue-100/80 mt-2 max-w-[550px] mx-auto font-medium leading-relaxed">
            Arah langkah dan komitmen Pondok Pesantren Khoiro Ummah Salem Brebes dalam mencetak generasi Rabbani dan berilmu.
          </p>
        </div>
      </div>

      {/* =========================================================
          AREA KONTEN UTAMA
          ========================================================= */}
      <div className="max-w-[1000px] mx-auto py-12 space-y-12">
        
        {/* SECTION VISI */}
        <section className="relative p-8 md:p-10 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-gray-200/60 shadow-xs overflow-hidden group text-center">
          {/* Efek Garis Menyala Biru di Atas Kartu */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-400 via-[#0066ad] to-indigo-500"></div>
          
          <h2 className="text-xs uppercase tracking-widest text-[#0066ad] font-extrabold mb-3">
            VISI PESANTREN
          </h2>
          <p className="text-lg md:text-2xl font-black text-slate-900 tracking-tight leading-relaxed max-w-[850px] mx-auto">
            "Mewujudkan Generasi Rabbani yang Berakhlak Mulia, Hafizh Al-Qur'an, Cerdas, Mandiri, dan Bermanfaat Bagi Ummat Berlandaskan Al-Qur'an dan As-Sunnah"
          </p>
        </section>

        {/* SECTION MISI: FUTURISTIC GRID CARDS */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">MISI UTAMA</h2>
            <div className="h-2 w-2 rounded-full bg-[#0066ad] animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {misiItems.map((misi, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-150 rounded-xl p-5 flex items-start gap-4 shadow-3xs hover:border-[#0066ad]/40 hover:shadow-2xs transition-all duration-300 relative group"
              >
                {/* Penomoran Besar Glow */}
                <div className="text-3xl md:text-4xl font-black text-slate-200 group-hover:text-blue-100 font-sans select-none tracking-tighter shrink-0 transition-colors duration-300">
                  0{index + 1}
                </div>
                
                {/* Detail Misi */}
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-800 group-hover:text-[#0066ad] transition-colors duration-300">
                    {misi.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
                    {misi.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}