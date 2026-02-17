import { FileText } from "lucide-react";
import React from "react";

import { CMSPage } from "@/services/cmsService";

interface CmsContentProps {
  page: CMSPage;
}

export function CmsContent({ page }: CmsContentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/10 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-pulse-slow" />
      <div
        className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="mx-auto max-w-4xl">
          {/* Enhanced Header Section */}
          <div className="text-center mb-12 space-y-6 animate-fade-in">
            {/* Icon Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-purple-50 rounded-full px-5 py-2.5 shadow-sm border border-primary-100/50">
              <FileText className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">
                Informasi Penting
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent font-heading leading-tight">
              {page.title}
            </h1>

            {/* Date Badge */}
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium">Berlaku sejak:</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full font-semibold text-gray-700">
                {page.publishedAt
                  ? new Date(page.publishedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </span>
            </div>

            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary-300" />
              <div className="h-2 w-2 rounded-full bg-primary-500" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary-300" />
            </div>
          </div>

          {/* Content Card */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-100 animate-slide-up">
            {/* Content Section */}
            <div className="px-8 py-12 sm:px-12 md:px-16">
              <article
                className="prose prose-lg max-w-none text-gray-600
                              prose-headings:font-heading prose-headings:font-bold prose-headings:text-gray-900
                              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-200
                              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-primary-700
                              prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
                              prose-p:leading-relaxed prose-p:mb-4
                              prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:text-primary-700
                              prose-strong:text-gray-900 prose-strong:font-semibold
                              prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6
                              prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6
                              prose-li:my-2 prose-li:marker:text-primary-500
                              prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>

            {/* Footer Note */}
            <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-primary-50/30 px-8 py-6 sm:px-12">
              <p className="text-sm text-gray-600 text-center">
                <span className="font-semibold text-gray-900">Catatan:</span>{" "}
                Jika Anda memiliki pertanyaan tentang halaman ini, silakan{" "}
                <a
                  href="/contact-us"
                  className="text-primary-600 font-medium hover:underline"
                >
                  hubungi kami
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
