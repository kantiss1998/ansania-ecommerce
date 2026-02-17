import { Info, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

import { cmsClient } from "@/lib/cms";

const PAGE_SLUG = "about";
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await cmsClient.getPage(PAGE_SLUG);
  if (!page) return { title: "Page Not Found" };

  return {
    title: `${page.title} - Ansania`,
  };
}

export default async function AboutPage() {
  const page = await cmsClient.getPage(PAGE_SLUG);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/10 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-pulse-slow" />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12 space-y-6 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-purple-50 rounded-full px-5 py-2.5 shadow-sm border border-primary-100/50">
            <Info className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">
              Tentang Kami
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent font-heading leading-tight">
            {page.title}
          </h1>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary-300" />
            <Sparkles className="h-5 w-5 text-primary-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary-300" />
          </div>
        </div>

        {/* Content Card */}
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 md:p-12 lg:p-16 shadow-xl border border-gray-100 animate-slide-up">
          <div
            className="prose prose-lg lg:prose-xl mx-auto text-gray-700 
                       prose-headings:font-heading prose-headings:text-gray-900
                       prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-200
                       prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-primary-700
                       prose-p:leading-relaxed prose-p:mb-6
                       prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-gray-900 prose-strong:font-semibold
                       prose-ul:list-disc prose-ul:my-6
                       prose-li:my-2 prose-li:marker:text-primary-500"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    </div>
  );
}
