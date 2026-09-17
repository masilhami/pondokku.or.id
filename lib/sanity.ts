// lib/sanity.ts

import { createClient } from '@sanity/client';
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url';

// =========================================================
// 1. KONFIGURASI UTAMA SANITY PONDOKKU.OR.ID
// =========================================================

/**
 * Project Sanity khusus pondokku.or.id
 *
 * Project ID:
 * 49hcvicd
 *
 * Project ID bukan data rahasia, jadi aman ditulis langsung.
 *
 * Sengaja TIDAK menggunakan:
 *
 * process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
 *
 * agar website ini tidak secara tidak sengaja terhubung
 * ke project Sanity website lain akibat ENV Vercel lama.
 */
export const projectId = '49hcvicd';

export const dataset = 'production';

/**
 * Sanity API Version.
 *
 * Gunakan tanggal tetap agar behavior API tidak berubah
 * secara tiba-tiba di masa depan.
 */
export const apiVersion = '2026-09-17';

// =========================================================
// 2. CLIENT PUBLIK / READ ONLY
// =========================================================

/**
 * Client utama untuk membaca data website.
 *
 * Digunakan untuk:
 *
 * - Berita
 * - Topik pilihan
 * - Prestasi siswa
 * - Slideshow
 * - Iklan
 * - Kategori
 * - Halaman utama
 * - Server Component
 * - API GET
 * - generateMetadata
 * - proses build Next.js
 *
 * PENTING:
 *
 * Client ini TIDAK menggunakan token.
 *
 * Dengan demikian query publik tidak akan mengalami error:
 *
 * "Unauthorized - Session does not match project host"
 *
 * akibat token milik project Sanity lain.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,

  /**
   * false:
   * mengambil data terbaru langsung dari Sanity Content Lake.
   *
   * Sangat cocok untuk website yang kontennya sering diperbarui.
   */
  useCdn: false,

  /**
   * Hanya mengambil dokumen yang sudah dipublish.
   *
   * Draft tidak ditampilkan ke website publik.
   */
  perspective: 'published',
});

// =========================================================
// 3. CLIENT WRITE / MUTATION
// =========================================================

/**
 * Gunakan fungsi ini HANYA untuk proses server-side:
 *
 * - app/api/.../route.ts
 * - webhook
 * - Server Action
 * - Cron
 * - patch()
 * - create()
 * - delete()
 *
 * Jangan digunakan di Client Component.
 *
 * Environment variable:
 *
 * SANITY_API_WRITE_TOKEN
 *
 * Token HARUS dibuat dari Sanity project:
 *
 * 49hcvicd
 *
 * Jangan menggunakan:
 *
 * NEXT_PUBLIC_SANITY_API_WRITE_TOKEN
 */
export function getWriteClient() {
  // -------------------------------------------------------
  // Proteksi agar write client tidak dijalankan di browser
  // -------------------------------------------------------

  if (typeof window !== 'undefined') {
    throw new Error(
      'Sanity write client hanya boleh digunakan di server.'
    );
  }

  // -------------------------------------------------------
  // Ambil private token
  // -------------------------------------------------------

  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!token) {
    throw new Error(
      'SANITY_API_WRITE_TOKEN belum tersedia. ' +
        'Tambahkan token Sanity project 49hcvicd ke Environment Variables.'
    );
  }

  // -------------------------------------------------------
  // Buat client khusus mutation
  // -------------------------------------------------------

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
    perspective: 'published',
  });
}

// =========================================================
// 4. IMAGE URL BUILDER
// =========================================================

/**
 * Sanity versi baru menggunakan named export:
 *
 * createImageUrlBuilder
 *
 * Bukan lagi:
 *
 * import imageUrlBuilder from '@sanity/image-url'
 *
 * sehingga warning:
 *
 * "The default export of @sanity/image-url has been deprecated"
 *
 * tidak muncul lagi.
 */
const imageBuilder = createImageUrlBuilder(client);

/**
 * Helper untuk membuat URL gambar Sanity.
 *
 * Contoh:
 *
 * urlFor(post.mainImage)
 *   .width(800)
 *   .height(450)
 *   .auto('format')
 *   .url()
 */
export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source);
}

// =========================================================
// 5. QUERY BERITA HALAMAN UTAMA
// =========================================================

/**
 * Mengambil seluruh berita dari tipe "post"
 * dan mengurutkannya berdasarkan publishedAt terbaru.
 */
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

/**
 * Mengambil satu berita berdasarkan slug.
 */
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

/**
 * Mengambil kategori yang memiliki:
 *
 * isHighlight == true
 *
 * kemudian mengambil dua berita terbaru di dalamnya.
 */
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
 * Mengambil iklan berdasarkan placement.
 *
 * Contoh placement:
 *
 * left
 * center
 * right
 * 300x600
 *
 * Tidak perlu mencari:
 *
 * "drafts." + $placement
 *
 * karena drafts. adalah prefix _id Sanity,
 * bukan nilai dari field placement.
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

/**
 * Hanya slideshow aktif yang ditampilkan.
 */
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

/**
 * Mengambil maksimal 10 berita terbaru.
 *
 * Range:
 *
 * [0..9]
 *
 * = 10 dokumen.
 */
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
// 11. QUERY SEMUA PRESTASI SISWA
// =========================================================

/**
 * Sesuai dengan schema:
 *
 * sanity/schemaTypes/prestasi.ts
 *
 * Prestasi terbaru tampil paling atas.
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

      asset->{
        _id,
        url,

        metadata {
          dimensions,
          lqip
        }
      }
    },

    deskripsi
  }
`;

// =========================================================
// 12. QUERY DETAIL PRESTASI
// =========================================================

/**
 * Mengambil satu prestasi berdasarkan Sanity Document ID.
 */
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

      asset->{
        _id,
        url,

        metadata {
          dimensions,
          lqip
        }
      }
    },

    deskripsi
  }
`;

// =========================================================
// 13. QUERY PRESTASI TERBARU
// =========================================================

/**
 * Mengambil maksimal 6 prestasi terbaru.
 *
 * [0..5] = 6 dokumen.
 *
 * Cocok untuk widget prestasi di homepage.
 */
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

    foto {
      ...,

      asset->{
        _id,
        url,

        metadata {
          dimensions,
          lqip
        }
      }
    },

    deskripsi
  }
`;