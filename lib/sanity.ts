// lib/sanity.ts

import { createClient } from '@sanity/client';

import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url';

// =========================================================
// 1. KONFIGURASI SANITY PONDOKKU.OR.ID
// =========================================================

// Tetap memakai project khusus website ini.
export const projectId = '49hcvicd';
export const dataset = 'production';
export const apiVersion = '2026-09-17';

// =========================================================
// 2. CLIENT PUBLIK
// =========================================================

// Client publik tanpa token.
// Hanya membaca dokumen yang sudah dipublikasikan.
//
// useCdn: false melewati CDN Sanity.
// Cache Next.js tetap diatur pada masing-masing client.fetch.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
});

// =========================================================
// 3. CLIENT MUTATION — HANYA UNTUK SERVER
// =========================================================

export function getWriteClient() {
  if (typeof window !== 'undefined') {
    throw new Error(
      'Sanity write client hanya boleh digunakan di server.'
    );
  }

  const token = process.env.SANITY_API_WRITE_TOKEN?.trim();

  if (!token) {
    throw new Error(
      'SANITY_API_WRITE_TOKEN belum tersedia. ' +
        'Tambahkan token dari project Sanity 49hcvicd ' +
        'ke Environment Variables server.'
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: 'published',
    token,
  });
}

// =========================================================
// 4. IMAGE URL BUILDER
// =========================================================

const imageBuilder = createImageUrlBuilder(client);

// Mendukung crop dan hotspot dari gambar Sanity.
//
// Contoh:
// urlFor(post.mainImage)
//   .width(1200)
//   .height(630)
//   .fit('crop')
//   .format('jpg')
//   .url();
export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source);
}

// =========================================================
// 5. QUERY SELURUH ARTIKEL UNTUK HOMEPAGE
// =========================================================

// Artikel harus mempunyai slug agar tautannya bisa dibuka.
// publishedAt kosong memakai tanggal pembuatan dokumen.
export const indexQuery = `
  *[
    _type == "post" &&
    defined(slug.current) &&
    slug.current != ""
  ]
  | order(
      coalesce(publishedAt, _createdAt) desc,
      _id asc
    ) {
    _id,
    title,
    "slug": slug.current,
    "publishedAt": coalesce(publishedAt, _createdAt),
    author,
    mainImage,
    youtubeUrl,
    "categoryTitle": category->title
  }
`;

// =========================================================
// 6. QUERY DETAIL ARTIKEL
// =========================================================

// mainImage diteruskan utuh:
// asset._ref, crop, hotspot, alt, dan caption.
//
// body diteruskan utuh, termasuk blok gambar,
// agar kompatibel dengan renderer PortableText.
export const postDetailQuery = `
  *[
    _type == "post" &&
    slug.current == $slug
  ]
  | order(_updatedAt desc, _id asc)[0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    "slug": slug.current,

    category->{
      _id,
      title,
      isHighlight
    },

    "publishedAt": coalesce(publishedAt, _createdAt),
    author,
    editor,
    mainImage,
    youtubeUrl,
    summary,
    body
  }
`;

// =========================================================
// 7. QUERY TOPIK PILIHAN
// =========================================================

// Jika beberapa kategori ditandai highlight,
// pilih kategori yang terakhir diperbarui.
//
// Ambil maksimal dua artikel dari kategori tersebut.
export const highlightCategoryQuery = `
  *[
    _type == "category" &&
    isHighlight == true
  ]
  | order(_updatedAt desc, _id asc)[0] {
    _id,
    title,

    "posts": *[
      _type == "post" &&
      defined(slug.current) &&
      slug.current != "" &&
      category._ref == ^._id
    ]
    | order(
        coalesce(publishedAt, _createdAt) desc,
        _id asc
      )[0..1] {
      _id,
      title,
      "slug": slug.current,
      "publishedAt": coalesce(publishedAt, _createdAt),
      mainImage,
      youtubeUrl
    }
  }
`;

// =========================================================
// 8. QUERY IKLAN
// =========================================================

// Jika placement sama digunakan beberapa iklan,
// pilih dokumen yang terakhir diperbarui.
export const adsQuery = `
  *[
    _type == "iklan" &&
    placement == $placement
  ]
  | order(_updatedAt desc, _id asc)[0] {
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

// Hanya mengambil slideshow aktif.
// Urutan kosong ditempatkan setelah urutan yang sudah diisi.
export const slideshowQuery = `
  *[
    _type == "slideshow" &&
    isActive == true
  ]
  | order(
      coalesce(order, 999999) asc,
      _id asc
    ) {
    _id,
    title,
    image,
    linkUrl,
    order
  }
`;

// =========================================================
// 10. QUERY SEPULUH ARTIKEL TERBARU
// =========================================================

export const terbaruQuery = `
  *[
    _type == "post" &&
    defined(slug.current) &&
    slug.current != ""
  ]
  | order(
      coalesce(publishedAt, _createdAt) desc,
      _id asc
    )[0..9] {
    _id,
    title,
    "slug": slug.current,
    "publishedAt": coalesce(publishedAt, _createdAt),
    author,
    mainImage,
    youtubeUrl,
    "categoryTitle": category->title
  }
`;

// =========================================================
// 11. QUERY SELURUH PRESTASI SISWA
// =========================================================

// Struktur foto dipertahankan agar tetap cocok
// dengan komponen prestasi yang sudah digunakan.
export const prestasiQuery = `
  *[
    _type == "prestasi"
  ]
  | order(
      coalesce(tanggalLomba, _createdAt) desc,
      _id asc
    ) {
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
// 13. QUERY ENAM PRESTASI TERBARU
// =========================================================

export const prestasiTerbaruQuery = `
  *[
    _type == "prestasi"
  ]
  | order(
      coalesce(tanggalLomba, _createdAt) desc,
      _id asc
    )[0..5] {
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