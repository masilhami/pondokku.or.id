// lib/sanity.ts

import { createClient } from '@sanity/client';
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url';

// =========================================================
// KONFIGURASI UTAMA SANITY
// =========================================================

/**
 * Project ID dan dataset boleh menggunakan NEXT_PUBLIC_
 * karena dua nilai ini BUKAN rahasia.
 *
 * Fallback dipakai supaya build tetap berjalan apabila
 * environment variable belum dibuat.
 */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ww6prabc';

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

/**
 * API version dibuat tetap agar perubahan API Sanity
 * di masa depan tidak tiba-tiba mengubah perilaku aplikasi.
 */
export const apiVersion = '2026-09-17';

// =========================================================
// 1. CLIENT UNTUK MEMBACA DATA PUBLIK
// =========================================================

/**
 * Client ini digunakan untuk:
 *
 * - halaman utama
 * - berita
 * - prestasi
 * - slideshow
 * - iklan
 * - kategori
 * - Server Component
 * - generateMetadata
 * - build / prerender Next.js
 *
 * PENTING:
 * Client ini TIDAK memakai token.
 *
 * Jangan masukkan SANITY_API_WRITE_TOKEN ke client ini.
 * Ini mencegah masalah:
 *
 * Unauthorized - Session does not match project host
 *
 * jika token yang tersimpan ternyata berasal dari project
 * Sanity yang berbeda.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,

  /**
   * false = selalu mengambil data terbaru langsung
   * dari Content Lake.
   *
   * Cocok untuk portal berita / website sekolah yang ingin
   * konten baru langsung muncul setelah publish.
   */
  useCdn: false,

  /**
   * Website publik hanya membaca konten yang sudah Publish.
   * Draft tidak akan ikut tampil.
   */
  perspective: 'published',
});

// =========================================================
// 2. CLIENT KHUSUS UNTUK WRITE / MUTATION
// =========================================================

/**
 * Gunakan client ini HANYA di server:
 *
 * - app/api/.../route.ts
 * - Server Action
 * - webhook
 * - cron server-side
 *
 * JANGAN import writeClient ke Client Component.
 *
 * Token HARUS:
 *
 * SANITY_API_WRITE_TOKEN
 *
 * JANGAN:
 *
 * NEXT_PUBLIC_SANITY_API_WRITE_TOKEN
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',

  /**
   * Private environment variable.
   * Jangan pernah menggunakan NEXT_PUBLIC_.
   */
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// =========================================================
// 3. HELPER VALIDASI WRITE TOKEN
// =========================================================

/**
 * Gunakan helper ini apabila Anda ingin memastikan
 * mutation tidak berjalan tanpa token.
 *
 * Contoh:
 *
 * const sanity = getWriteClient();
 *
 * await sanity
 *   .patch(id)
 *   .set({ views: 10 })
 *   .commit();
 */
export function getWriteClient() {
  if (typeof window !== 'undefined') {
    throw new Error(
      'getWriteClient() hanya boleh digunakan di server.'
    );
  }

  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!token) {
    throw new Error(
      'SANITY_API_WRITE_TOKEN belum tersedia di environment variable.'
    );
  }

  return client.withConfig({
    token,
    useCdn: false,
  });
}

// =========================================================
// 4. IMAGE URL BUILDER
// =========================================================

/**
 * @sanity/image-url versi terbaru menggunakan:
 *
 * createImageUrlBuilder
 *
 * bukan lagi:
 *
 * import imageUrlBuilder from '@sanity/image-url'
 */
const builder = createImageUrlBuilder(client);

/**
 * Contoh penggunaan:
 *
 * urlFor(post.mainImage)
 *   .width(800)
 *   .height(450)
 *   .auto('format')
 *   .url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// =========================================================
// 5. QUERY BERITA HALAMAN UTAMA
// =========================================================

export const indexQuery = `
  *[
    _type == "post"
  ]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    author,
    mainImage,
    youtubeUrl,
    "categoryTitle": category->title
  }
`;

// =========================================================
// 6. QUERY DETAIL BERITA
// =========================================================

export const postDetailQuery = `
  *[
    _type == "post" &&
    slug.current == $slug
  ][0] {
    _id,
    title,
    "slug": slug.current,

    category->{
      _id,
      title,
      isHighlight
    },

    publishedAt,
    author,
    editor,
    mainImage,
    youtubeUrl,
    summary,
    body
  }
`;

// =========================================================
// 7. QUERY TOPIK PILIHAN / HIGHLIGHT
// =========================================================

export const highlightCategoryQuery = `
  *[
    _type == "category" &&
    isHighlight == true
  ][0] {
    _id,
    title,

    "posts":
      *[
        _type == "post" &&
        references(^._id)
      ]
      | order(publishedAt desc)[0..1] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        mainImage,
        youtubeUrl
      }
  }
`;

// =========================================================
// 8. QUERY IKLAN
// =========================================================

/**
 * Tidak perlu:
 *
 * placement == "drafts." + $placement
 *
 * karena "drafts." adalah prefix _id dokumen,
 * bukan isi field placement.
 *
 * Client publik menggunakan perspective: "published",
 * jadi hanya iklan yang sudah Publish yang ditampilkan.
 */
export const adsQuery = `
  *[
    _type == "iklan" &&
    placement == $placement
  ][0] {
    _id,
    title,
    image,
    linkUrl,
    placement
  }
`;

// =========================================================
// 9. QUERY SLIDESHOW
// =========================================================

export const slideshowQuery = `
  *[
    _type == "slideshow" &&
    isActive == true
  ]
  | order(order asc) {
    _id,
    title,
    image,
    linkUrl,
    order
  }
`;

// =========================================================
// 10. QUERY POSTINGAN TERBARU
// =========================================================

export const terbaruQuery = `
  *[
    _type == "post"
  ]
  | order(publishedAt desc)[0..9] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    author,
    mainImage,
    youtubeUrl,
    "categoryTitle": category->title
  }
`;

// =========================================================
// 11. QUERY PRESTASI SISWA
// =========================================================

/**
 * Sesuai schema:
 *
 * sanity/schemaTypes/prestasi.ts
 */
export const prestasiQuery = `
  *[
    _type == "prestasi"
  ]
  | order(tanggalLomba desc) {
    _id,
    jenisLomba,
    juaraLomba,
    namaSiswa,
    tanggalLomba,

    foto {
      ...,
      asset->
    },

    deskripsi
  }
`;

// =========================================================
// 12. QUERY DETAIL PRESTASI BERDASARKAN ID
// =========================================================

export const prestasiDetailQuery = `
  *[
    _type == "prestasi" &&
    _id == $id
  ][0] {
    _id,
    jenisLomba,
    juaraLomba,
    namaSiswa,
    tanggalLomba,

    foto {
      ...,
      asset->
    },

    deskripsi
  }
`;

// =========================================================
// 13. QUERY PRESTASI TERBARU
// =========================================================

export const prestasiTerbaruQuery = `
  *[
    _type == "prestasi"
  ]
  | order(tanggalLomba desc)[0..5] {
    _id,
    jenisLomba,
    juaraLomba,
    namaSiswa,
    tanggalLomba,
    foto,
    deskripsi
  }
`;