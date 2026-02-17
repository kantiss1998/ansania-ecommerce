import { MessageSquare, Sparkles, Send } from "lucide-react";
import { notFound } from "next/navigation";

import { ContactForm } from "@/components/features/contact/ContactForm";
import { cmsClient } from "@/lib/cms";

const PAGE_SLUG = "contact-us";
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await cmsClient.getPage(PAGE_SLUG);
  if (!page) return { title: "Page Not Found" };

  return {
    title: `${page.title} - Ansania`,
  };
}

export default async function ContactPage() {
  const page = await cmsClient.getPage(PAGE_SLUG);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/10 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-pulse-slow" />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16 space-y-6 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-purple-50 rounded-full px-5 py-2.5 shadow-sm border border-primary-100/50">
            <MessageSquare className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">
              Hubungi Kami
            </span>
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent font-heading leading-tight mb-4">
              {page.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami siap membantu Anda! Hubungi kami untuk pertanyaan, saran,
              atau bantuan.
            </p>
          </div>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary-300" />
            <Sparkles className="h-5 w-5 text-primary-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-7xl mx-auto">
          {/* Left Column: CMS Content (Address, Info) */}
          <div className="rounded-3xl bg-gradient-to-br from-primary-50/50 to-purple-50/30 p-8 md:p-10 shadow-lg border border-gray-100 animate-slide-up">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                <MessageSquare className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Informasi Kontak
                </span>
              </div>
            </div>

            <div
              className="prose prose-lg text-gray-700
                         prose-headings:font-heading prose-headings:text-gray-900
                         prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-4
                         prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-3 prose-h3:text-primary-700
                         prose-p:leading-relaxed prose-p:mb-4
                         prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                         prose-ul:my-4
                         prose-li:my-2"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>

          {/* Right Column: Contact Form */}
          <div
            className="rounded-3xl bg-white p-8 md:p-10 shadow-xl border border-gray-100 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-purple-50 rounded-full px-4 py-2 shadow-sm border border-primary-100/50 mb-4">
                <Send className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">
                  Form Kontak
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 font-heading mb-2">
                Kirim Pesan
              </h2>
              <p className="text-gray-600">
                Isi form di bawah ini dan kami akan segera menghubungi Anda
                kembali.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
