import { HelpCircle, Search, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

import { cmsClient } from "@/lib/cms";

const PAGE_SLUG = "faq";
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await cmsClient.getPage(PAGE_SLUG);
  if (!page) return { title: "Page Not Found" };

  return {
    title: `${page.title} - Ansania`,
  };
}

export default async function FAQPage() {
  const page = await cmsClient.getPage(PAGE_SLUG);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/10 to-white">
      {/* Enhanced Hero Header */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-20 text-center text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 mb-6 border border-white/20">
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm font-semibold">Pusat Bantuan</span>
          </div>

          <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight">
            {page.title}
          </h1>
          <p className="mx-auto max-w-2xl text-primary-100 text-lg md:text-xl leading-relaxed mb-10">
            Ada pertanyaan? Kami di sini untuk membantu. Telusuri pertanyaan
            yang sering diajukan di bawah ini.
          </p>

          {/* Enhanced Search Input */}
          <div className="mx-auto max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari jawaban yang Anda butuhkan..."
                  className="w-full rounded-2xl border-none py-4 pl-14 pr-6 text-gray-900 shadow-xl focus:ring-4 focus:ring-primary-200 transition-all bg-white"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/40" />
            <Sparkles className="h-5 w-5 text-white/80" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/40" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-12 pb-20 relative z-10">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 md:p-12 lg:p-16 shadow-2xl border border-gray-100 animate-fade-in">
          {/* Last Updated Badge */}
          <div className="mb-10 flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-purple-50 rounded-full px-4 py-2">
              <span className="text-sm font-semibold text-gray-700">
                Terakhir diperbarui:{" "}
                <span className="text-primary-700">
                  {new Date(page.updated_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </span>
            </div>
          </div>

          {/* FAQ Content */}
          <article
            className="prose prose-lg max-w-none 
                        prose-headings:font-heading prose-headings:font-bold prose-headings:text-gray-900
                        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-gray-200
                        prose-h3:text-2xl prose-h3:text-primary-700 prose-h3:mt-10 prose-h3:mb-4 prose-h3:flex prose-h3:items-center prose-h3:gap-2
                        prose-h3:before:content-['Q:'] prose-h3:before:text-primary-600 prose-h3:before:font-bold prose-h3:before:text-xl
                        prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                        prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-gray-900 prose-strong:font-semibold
                        prose-ul:list-disc prose-ul:my-6 prose-ul:pl-6
                        prose-li:my-2 prose-li:marker:text-primary-500"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl bg-gradient-to-br from-primary-50 to-purple-50/50 border border-primary-100">
            <HelpCircle className="h-12 w-12 text-primary-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Tidak menemukan jawaban?
              </h3>
              <p className="text-gray-600 mb-4">
                Tim kami siap membantu Anda dengan pertanyaan apapun
              </p>
            </div>
            <a
              href="/contact-us"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all hover:-translate-y-0.5"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
