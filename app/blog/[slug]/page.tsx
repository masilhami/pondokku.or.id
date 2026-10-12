// app/blog/[slug]/page.tsx

import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";

import LeftIklan from "@/components/LeftIklan";
import SidebarIklan from "@/components/SidebarIklan";
import SidebarPopuler from "@/components/SidebarPopuler";

import {
  client,
  postDetailQuery,
  indexQuery,
  urlFor,
} from "@/lib/sanity";

import {
  FaThumbsUp,
  FaThumbsDown,
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
  FaBookmark,
} from "react-icons/fa";

import { RiTwitterXFill } from "react-icons/ri";
import { BiCommentDetail } from "react-icons/bi";

const SITE_URL = "https://pondokku.or.id";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Dipakai bersama oleh halaman dan generateMetadata.
// React cache menghindari pengambilan artikel dua kali dalam satu render.
const getArticle = cache(async (slug: string) => {
  return client.fetch(
    postDetailQuery,
    { slug },
    { cache: "no-store" }
  );
});

function getArticleUrl(slug: string): string {
  return new URL(
    `/blog/${encodeURIComponent(slug)}`,
    SITE_URL
  ).href;
}

function getYoutubeId(url?: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    let id: string | null = null;

    if (host === "youtu.be" || host === "www.youtu.be") {
      id = parsed.pathname.split("/").filter(Boolean)[0] ?? null;
    } else if (
      host === "youtube.com" ||
      host.endsWith(".youtube.com") ||
      host === "youtube-nocookie.com" ||
      host.endsWith(".youtube-nocookie.com")
    ) {
      const parts = parsed.pathname.split("/").filter(Boolean);

      if (parts[0] === "watch") {
        id = parsed.searchParams.get("v");
      } else if (
        ["embed", "shorts", "live", "v"].includes(parts[0] ?? "")
      ) {
        id = parts[1] ?? null;
      }
    }

    return id && /^[a-zA-Z0-9_-]{11}$/.test(id)
      ? id
      : null;
  } catch {
    return null;
  }
}

function getSanityImageUrl(imageSource: any): string | null {
  if (!imageSource?.asset?._ref) return null;

  try {
    return urlFor(imageSource)
      .width(1200)
      .fit("max")
      .auto("format")
      .url();
  } catch {
    return null;
  }
}

function getFirstBodyImage(article: any): any {
  if (!Array.isArray(article.body)) return null;

  return (
    article.body.find(
      (block: any) =>
        block._type === "image" && block.asset?._ref
    ) ?? null
  );
}

function getThumbnail(post: any): string | null {
  const sanityImage = getSanityImageUrl(post.mainImage);

  if (sanityImage) return sanityImage;

  const youtubeId = getYoutubeId(post.youtubeUrl);

  return youtubeId
    ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
    : null;
}

function getShareImage(article: any): string | null {
  const candidates = [
    article.mainImage,
    getFirstBodyImage(article),
  ];

  for (const image of candidates) {
    if (!image?.asset?._ref) continue;

    try {
      return urlFor(image)
        .width(1200)
        .height(630)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url();
    } catch {
      // Coba sumber gambar berikutnya.
    }
  }

  const youtubeId = getYoutubeId(article.youtubeUrl);

  return youtubeId
    ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
    : null;
}

function getArticleDescription(article: any): string {
  const summary = Array.isArray(article.summary)
    ? article.summary
        .filter(
          (item: unknown): item is string =>
            typeof item === "string"
        )
        .join(" ")
    : "";

  const bodyText = Array.isArray(article.body)
    ? article.body
        .filter((block: any) => block._type === "block")
        .map((block: any) =>
          (block.children ?? [])
            .map((child: any) => child.text ?? "")
            .join("")
        )
        .join(" ")
    : "";

  return (summary || bodyText || article.title || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

function getValidDate(dateString?: string): Date | null {
  if (!dateString) return null;

  const date = new Date(dateString);

  return Number.isNaN(date.getTime()) ? null : date;
}

function timeAgo(dateString?: string): string {
  const date = getValidDate(dateString);

  if (!date) return "Baru saja";

  const diffMs = Date.now() - date.getTime();

  if (diffMs < 60000) return "Baru saja";

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);

  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;

  return date.toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
  });
}

function formatDate(dateString?: string): string {
  const date = getValidDate(dateString);

  if (!date) return "";

  return (
    date.toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB"
  );
}

// Metadata khusus setiap artikel untuk preview share.
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const title = article.title || "Artikel";
  const description = getArticleDescription(article);
  const articleUrl = getArticleUrl(slug);
  const imageUrl = getShareImage(article);
  const publishedDate = getValidDate(article.publishedAt);

  return {
    title,
    description,

    alternates: {
      canonical: articleUrl,
    },

    openGraph: {
      type: "article",
      locale: "id_ID",
      url: articleUrl,
      title,
      description,

      ...(publishedDate
        ? { publishedTime: publishedDate.toISOString() }
        : {}),

      ...(article.author
        ? { authors: [article.author] }
        : {}),

      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: title,
            },
          ]
        : [],
    },

    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

// Renderer gambar yang disisipkan dalam isi artikel.
const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const imageUrl = getSanityImageUrl(value);

      if (!imageUrl) return null;

      return (
        <figure className="my-6">
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buka gambar ukuran besar"
            className="block"
          >
            <img
              src={imageUrl}
              alt={value.alt || value.caption || ""}
              loading="lazy"
              decoding="async"
              className="block w-full h-auto rounded-lg"
            />
          </a>

          {value.caption && (
            <figcaption className="mt-2 text-center text-xs leading-relaxed text-gray-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },

  block: {
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),

    h1: ({ children }) => (
      <h2 className="mt-7 mb-3 text-xl font-medium text-gray-800">
        {children}
      </h2>
    ),

    h2: ({ children }) => (
      <h2 className="mt-7 mb-3 text-xl font-medium text-gray-800">
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3 className="mt-6 mb-3 text-lg font-medium text-gray-800">
        {children}
      </h3>
    ),

    h4: ({ children }) => (
      <h4 className="mt-5 mb-2 text-base font-medium text-gray-800">
        {children}
      </h4>
    ),

    blockquote: ({ children }) => (
      <blockquote className="my-5 border-l-4 border-gray-300 pl-4 text-gray-600 italic">
        {children}
      </blockquote>
    ),
  },
};

function VideoBadge() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
      <div className="w-7 h-7 bg-red-600/90 text-white rounded-full flex items-center justify-center">
        <svg
          className="w-3 h-3 fill-current ml-0.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
}

export default async function BlogDetailPage(props: Props) {
  const { slug } = await props.params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const allPosts =
    (await client.fetch<any[]>(
      indexQuery,
      {},
      { cache: "no-store" }
    )) ?? [];

  const youtubeId = getYoutubeId(article.youtubeUrl);
  const mainImageUrl = getSanityImageUrl(article.mainImage);

  const finalImageSrc =
    mainImageUrl ||
    getSanityImageUrl(getFirstBodyImage(article)) ||
    (youtubeId
      ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
      : null);

  const otherPosts = allPosts.filter(
    (post) =>
      typeof post.slug === "string" &&
      post.slug.length > 0 &&
      post.slug !== slug
  );

  const beritaTerkait = article.category?.title
    ? otherPosts
        .filter(
          (post) =>
            post.categoryTitle === article.category.title
        )
        .slice(0, 5)
    : [];

  const fallbackTerkait =
    beritaTerkait.length > 0
      ? beritaTerkait
      : otherPosts.slice(0, 5);

  const beritaTerkini = otherPosts.slice(0, 6);

  const summary = Array.isArray(article.summary)
    ? article.summary.filter(
        (item: unknown): item is string =>
          typeof item === "string"
      )
    : [];

  const articleUrl = getArticleUrl(slug);
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(article.title || "");
  const encodedShareText = encodeURIComponent(
    `${article.title || "Artikel"}\n${articleUrl}`
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 mt-4 pb-12">
      <div className="flex flex-col lg:flex-row gap-6 w-full relative items-start">
        <div className="flex-1 min-w-0 space-y-4">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="w-full bg-[#f6f6f6] border border-gray-200 flex items-stretch text-[11px] h-7 select-none overflow-hidden font-sans"
          >
            <Link
              href="/"
              className="bg-[#0066ad] text-white flex items-center pl-4 pr-6 font-medium hover:bg-[#005596] transition-colors relative z-30
                after:content-[''] after:absolute after:top-0 after:right-0 after:translate-x-full
                after:border-t-[14px] after:border-t-transparent after:border-b-[14px] after:border-b-transparent
                after:border-l-[10px] after:border-l-[#0066ad]"
            >
              Home
            </Link>

            <span
              className="bg-[#5ca2df] text-white flex items-center pl-7 pr-6 font-medium relative z-20
                after:content-[''] after:absolute after:top-0 after:right-0 after:translate-x-full
                after:border-t-[14px] after:border-t-transparent after:border-b-[14px] after:border-b-transparent
                after:border-l-[10px] after:border-l-[#5ca2df]"
            >
              Blog
            </span>

            <span className="bg-[#d2e5f5] text-[#0066ad] flex items-center pl-7 pr-4 font-normal truncate">
              {article.category?.title || "Artikel"}
            </span>
          </nav>

          <main className="w-full border border-gray-200 rounded-xl bg-white space-y-6">
            <div className="p-4 md:p-6 pb-0 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-medium text-red-600 uppercase tracking-wide block">
                  {article.category?.title || "BERITA TERKINI"}
                </span>

                <h1 className="text-2xl md:text-[32px] font-medium font-serif text-gray-800 leading-tight break-words">
                  {article.title}
                </h1>
              </div>

              <div className="text-xs text-gray-500 space-y-1 border-b border-gray-100 pb-4">
                <p>
                  Tayang:{" "}
                  <span className="font-normal">
                    {formatDate(article.publishedAt)}
                  </span>
                </p>

                <p>
                  Penulis:{" "}
                  <span className="text-[#0b74b6] font-medium">
                    {article.author || "Redaksi"}
                  </span>

                  {article.editor && (
                    <>
                      {" | Editor: "}
                      <span className="text-[#0b74b6] font-medium">
                        {article.editor}
                      </span>
                    </>
                  )}
                </p>
              </div>

              {/* Tombol share */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 text-gray-400 text-sm overflow-x-auto gap-4">
                <div className="flex items-center gap-5 shrink-0">
                  <button
                    type="button"
                    aria-label="Suka"
                    className="hover:text-[#0b74b6] text-base"
                  >
                    <FaThumbsUp />
                  </button>

                  <button
                    type="button"
                    aria-label="Tidak suka"
                    className="hover:text-red-600 text-base"
                  >
                    <FaThumbsDown />
                  </button>

                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Bagikan ke X"
                    className="hover:text-gray-800 text-base"
                  >
                    <RiTwitterXFill />
                  </a>

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Bagikan ke Facebook"
                    className="hover:text-blue-600 text-base"
                  >
                    <FaFacebook />
                  </a>

                  <a
                    href={`https://wa.me/?text=${encodedShareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Bagikan ke WhatsApp"
                    className="hover:text-green-500 text-base"
                  >
                    <FaWhatsapp />
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Bagikan ke Telegram"
                    className="hover:text-blue-400 text-base"
                  >
                    <FaTelegram />
                  </a>

                  <a
                    href="#komentar"
                    aria-label="Menuju komentar"
                    className="hover:text-gray-800 text-base"
                  >
                    <BiCommentDetail />
                  </a>
                </div>

                <button
                  type="button"
                  aria-label="Simpan artikel"
                  className="hover:text-[#0b74b6] text-base shrink-0"
                >
                  <FaBookmark />
                </button>
              </div>

              {/* Video atau gambar utama */}
              {youtubeId ? (
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
                  <iframe
                    className="w-full h-full border-0"
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={article.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : finalImageSrc ? (
                <figure className="space-y-2">
                  <div className="w-full aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden relative border border-gray-100">
                    <img
                      src={finalImageSrc}
                      alt={article.mainImage?.alt || article.title}
                      className="w-full h-full object-cover object-center"
                      decoding="async"
                    />

                    <a
                      href={finalImageSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] md:text-xs px-2 py-1 rounded"
                    >
                      🔍 lihat foto
                    </a>
                  </div>

                  {mainImageUrl && article.mainImage?.caption && (
                    <figcaption className="text-xs text-gray-500 leading-relaxed">
                      {article.mainImage.caption}
                    </figcaption>
                  )}
                </figure>
              ) : null}
            </div>

            {/* Iklan kiri dan isi artikel */}
            <div className="flex flex-col md:flex-row w-full items-start pt-2 px-4 md:px-6">
              <div className="w-[160px] shrink-0 hidden md:block sticky top-20 mr-6 pb-6">
                <LeftIklan isSticky={true} />
              </div>

              <div className="flex-1 min-w-0 space-y-6">
                {summary.length > 0 && (
                  <div className="border-l-4 border-[#0b74b6] bg-blue-50/30 rounded-r-xl p-4 md:p-5 space-y-3">
                    <h2 className="text-xs font-medium text-[#0b74b6] uppercase tracking-wide">
                      Ringkasan Berita:
                    </h2>

                    <ul className="list-disc pl-5 text-xs text-gray-700 space-y-2 leading-relaxed">
                      {summary.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-sm md:text-base text-gray-800 leading-relaxed prose prose-blue max-w-none pb-8 break-words">
                  <PortableText
                    value={article.body ?? []}
                    components={portableTextComponents}
                  />
                </div>
              </div>
            </div>

            <div className="w-full border-t border-gray-200 p-4 md:p-6 space-y-8 bg-white rounded-b-xl">
              {/* Berita terkait */}
              {fallbackTerkait.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-sm font-medium text-[#0b74b6] border-b-2 border-[#0b74b6] pb-1.5 w-max uppercase">
                    Berita <span className="text-red-600">Terkait</span>
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {fallbackTerkait.map((item: any) => {
                      const image = getThumbnail(item);

                      return (
                        <div
                          key={item._id || item.slug}
                          className="space-y-1.5 flex flex-col group"
                        >
                          <Link
                            href={`/blog/${encodeURIComponent(item.slug)}`}
                            className="block relative aspect-[4/3] bg-gray-100 overflow-hidden border border-gray-200"
                          >
                            {image ? (
                              <img
                                src={image}
                                alt={item.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <span className="flex h-full items-center justify-center text-[10px] text-gray-400">
                                Tanpa gambar
                              </span>
                            )}

                            {getYoutubeId(item.youtubeUrl) && (
                              <VideoBadge />
                            )}
                          </Link>

                          <Link
                            href={`/blog/${encodeURIComponent(item.slug)}`}
                          >
                            <h3 className="text-[11px] font-medium text-[#0066ad] group-hover:underline leading-snug line-clamp-3">
                              {item.title}
                            </h3>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Komentar: tampilan form dari kode sebelumnya */}
              <section
                id="komentar"
                className="space-y-3 pt-6 border-t border-gray-200 scroll-mt-24"
              >
                <h2 className="text-sm font-medium text-[#0b74b6] border-b-2 border-[#0b74b6] pb-1.5 w-max uppercase">
                  Kirim <span className="text-red-600">Komentar</span>
                </h2>

                <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-200">
                  <textarea
                    rows={3}
                    aria-label="Isi komentar"
                    placeholder="Tulis komentar Anda..."
                    className="w-full text-xs p-3 border border-gray-300 rounded-lg resize-none font-sans outline-none focus:border-[#0b74b6]"
                  />

                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <p className="text-[9px] text-gray-400 italic">
                      Isi komentar sepenuhnya menjadi tanggung jawab
                      pengguna dan diatur dalam UU ITE.
                    </p>

                    <button
                      type="button"
                      className="bg-[#0b74b6] text-white text-[11px] font-medium px-5 py-1.5 rounded-md uppercase hover:bg-[#005596]"
                    >
                      Kirim
                    </button>
                  </div>
                </div>
              </section>

              {/* Berita terkini */}
              {beritaTerkini.length > 0 && (
                <section className="space-y-4 pt-6 border-t border-gray-200">
                  <h2 className="text-sm font-medium text-[#0b74b6] border-b-2 border-[#0b74b6] pb-1.5 w-max uppercase">
                    Berita <span className="text-red-600">Terkini</span>
                  </h2>

                  <div className="divide-y divide-gray-100">
                    {beritaTerkini.map((news: any) => {
                      const image = getThumbnail(news);

                      return (
                        <div
                          key={news._id || news.slug}
                          className="flex gap-4 py-4 items-start group"
                        >
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <Link
                              href={`/blog/${encodeURIComponent(news.slug)}`}
                            >
                              <h3 className="font-medium text-sm text-[#0066ad] group-hover:underline line-clamp-2 leading-snug">
                                {news.title}
                              </h3>
                            </Link>

                            <div className="text-[11px] text-gray-500 flex flex-wrap items-center gap-1.5">
                              <span className="font-medium text-red-600 uppercase tracking-wide">
                                {news.categoryTitle || "Umum"}
                              </span>

                              <span className="text-gray-300">•</span>
                              <span>{timeAgo(news.publishedAt)}</span>
                            </div>
                          </div>

                          <Link
                            href={`/blog/${encodeURIComponent(news.slug)}`}
                            className="w-24 h-20 sm:w-40 sm:h-24 bg-gray-100 shrink-0 overflow-hidden relative border border-gray-200 block"
                          >
                            {image ? (
                              <img
                                src={image}
                                alt={news.title}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="flex h-full items-center justify-center text-[10px] text-gray-400">
                                Tanpa gambar
                              </span>
                            )}

                            {getYoutubeId(news.youtubeUrl) && (
                              <VideoBadge />
                            )}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          </main>
        </div>

        {/* Sidebar kanan */}
        <aside className="w-full lg:w-[300px] shrink-0 flex flex-col gap-6 lg:sticky lg:top-20 pb-12">
          <SidebarIklan />
          <SidebarPopuler />
        </aside>
      </div>
    </div>
  );
}