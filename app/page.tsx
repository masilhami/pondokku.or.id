// app/page.tsx

import NewsHighlights from "@/components/NewsHighlights";
import SidebarSlideshow from "@/components/SidebarSlideshow";
import LeftIklan from "@/components/LeftIklan";
import MainHeadline from "@/components/MainHeadline";
import SidebarIklan from "@/components/SidebarIklan";
import SubContentList from "@/components/SubContentList";
import SidebarPopuler from "@/components/SidebarPopuler";
import PhotoAndNewsList from "@/components/PhotoAndNewsList";

import {
  client,
  indexQuery,
  highlightCategoryQuery,
  slideshowQuery,
} from "@/lib/sanity";

interface NewsItem {
  title: string;
  slug: string;
  publishedAt?: string;
  mainImage?: any;
  youtubeUrl?: string;
  categoryTitle?: string;
}

export default async function HomePage() {
  // Ambil data baru pada setiap permintaan halaman.
  const [postsResult, activeHighlight, slidesResult] = await Promise.all([
    client.fetch<NewsItem[]>(indexQuery, {}, { cache: "no-store" }),

    client.fetch(highlightCategoryQuery, {}, { cache: "no-store" }),

    client.fetch(slideshowQuery, {}, { cache: "no-store" }),
  ]);

  const allPosts = postsResult ?? [];
  const slideData = slidesResult ?? [];

  const headlinePosts = allPosts.slice(0, 5);
  const rekomendasiPosts = allPosts.slice(5, 9);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 mt-6 space-y-6 pb-12">
      <div className="flex flex-col lg:flex-row gap-4 w-full items-stretch">
        <div className="flex-1 min-w-0">
          <NewsHighlights highlightData={activeHighlight} />
        </div>

        <div className="w-full lg:w-[300px] shrink-0">
          <SidebarSlideshow slides={slideData} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full relative">
        <div className="w-[160px] shrink-0 hidden lg:block">
          <div className="sticky top-20">
            <LeftIklan isSticky={true} />
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-6">
          <MainHeadline posts={headlinePosts} />

          {rekomendasiPosts.length > 0 && (
            <SubContentList posts={rekomendasiPosts} />
          )}

          <PhotoAndNewsList posts={allPosts} />
        </div>

        <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-6">
          <SidebarIklan />

          <div className="w-full sticky top-20">
            <SidebarPopuler isSticky={false} />
          </div>
        </div>
      </div>
    </div>
  );
}