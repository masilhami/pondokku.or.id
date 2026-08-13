import React from 'react';

export default function ProfilPage() {
  return (
    // Mengunci induk kontainer terluar dengan max-w-[1200px] mx-auto agar sejajar lurus dengan batas web & navbar
    <div className="w-full max-w-[1200px] mx-auto px-4 font-sans text-gray-800 mt-6 min-h-screen">
      
      {/* =========================================================
          HERO HEADER: DIKUNCI PAS DI DALAM LAYOUT WEB
          ========================================================= */}
      <div className="w-full bg-gradient-to-r from-[#0066ad] to-[#004b80] py-12 text-white text-center rounded-xl shadow-xs">
        <div className="w-full px-4">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Profil Pesantren</h1>
          <p className="text-xs md:text-sm text-gray-200 mt-2 max-w-[600px] mx-auto font-medium">
            Mengenal lebih dekat Pondok Pesantren Khoiro Ummah, mencetak generasi Rabbani yang berakhlak mulia, berilmu, dan berprestasi.
          </p>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="max-w-[800px] mx-auto py-10 space-y-8 leading-relaxed">
        
        {/* SECTION 1: SEJARAH & GAMBARAN UMUM */}
        <section className="space-y-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-l-4 border-[#0066ad] pl-3">
            Gambaran Umum
          </h2>
          <p className="text-sm md:text-base text-gray-600 text-justify">
            Pondok Pesantren Khoiro Ummah terletak di lokasi yang asri dan kondusif untuk kegiatan belajar mengajar serta tahfidz Al-Qur'an. Berada di Desa Bentar, Kecamatan Salem, Kabupaten Brebes, Jawa Tengah, pesantren ini hadir sebagai wadah pembentukan karakter keislaman yang kokoh dan berwawasan luas.
          </p>
          <p className="text-sm md:text-base text-gray-600 text-justify">
            Masyarakat di lingkungan sekitar pesantren mengedepankan nilai-nilai gotong royong dan nilai keislaman yang kental. Kebersamaan masyarakat ini menjadi salah satu penopang utama dalam mendukung berbagai program keagamaan dan kemasyarakatan yang diselenggarakan oleh pesantren.
          </p>
          <p className="text-sm md:text-base text-gray-600 text-justify">
            Dengan bimbingan para ustaz dan pengasuh yang kompeten di bidangnya, Pondok Pesantren Khoiro Ummah terus berkomitmen menyelenggarakan pendidikan berbasis kurikulum pesantren terpadu yang memadukan keilmuan syar'i, tahfidzul Qur'an, serta pembinaaan akhlakul karimah.
          </p>
        </section>

        {/* SECTION 2: IDENTITAS STRUKTURAL */}
        <section className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-3xs">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Identitas Pesantren</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400 block font-medium text-xs uppercase tracking-wider">Nama Lembaga</span>
              <span className="font-semibold text-gray-800 text-sm md:text-base">Pondok Pesantren Khoiro Ummah</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium text-xs uppercase tracking-wider">Domain Resmi</span>
              <span className="font-semibold text-gray-800 text-sm md:text-base">www.pondokku.or.id</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium text-xs uppercase tracking-wider">Desa / Kelurahan</span>
              <span className="font-semibold text-gray-800 text-sm md:text-base">Bentar</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium text-xs uppercase tracking-wider">Kecamatan</span>
              <span className="font-semibold text-gray-800 text-sm md:text-base">Salem</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium text-xs uppercase tracking-wider">Kabupaten / Provinsi</span>
              <span className="font-semibold text-gray-800 text-sm md:text-base">Brebes / Jawa Tengah</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium text-xs uppercase tracking-wider">Fokus Program</span>
              <span className="font-semibold text-gray-800 text-sm md:text-base">Tahfidz & Dirasah Islamiyah</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium text-xs uppercase tracking-wider">Pengasuh & Ustaz</span>
              <span className="font-semibold text-gray-800 text-sm md:text-base">Tim Pengajar Berpengalaman</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium text-xs uppercase tracking-wider">Status Lembaga</span>
              <span className="text-green-600 font-extrabold text-sm md:text-base bg-green-50 px-2.5 py-0.5 rounded-md inline-block border border-green-100 mt-0.5">
                Aktif & Terdaftar
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}