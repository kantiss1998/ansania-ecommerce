"use client";

import { CMSPage } from "@repo/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { adminCmsService } from "@/services/adminCmsService";

interface CMSPageFormProps {
  initialData?: CMSPage;
}

export function CMSPageForm({ initialData }: CMSPageFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    is_published: initialData?.is_published ?? true,
    meta_title: initialData?.metadata?.meta_title || "",
    meta_description: initialData?.metadata?.meta_description || "",
  });

  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        is_published: formData.is_published,
        metadata: {
          meta_title: formData.meta_title,
          meta_description: formData.meta_description,
        },
      };

      if (isEdit && initialData) {
        await adminCmsService.updatePage(initialData.id, payload);
      } else {
        await adminCmsService.createPage(payload);
      }
      router.push("/admin/cms/pages");
      router.refresh();
    } catch (error) {
      console.error("Submit page error:", error);
      alert("Gagal menyimpan halaman.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit
              ? `Edit Halaman: ${initialData.title}`
              : "Buat Halaman Baru"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Kelola konten statis seperti Terms & Conditions, About Us, atau FAQ
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => router.back()}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
          >
            {isEdit ? "Update Halaman" : "Publikasikan"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Judul Halaman
              </label>
              <input
                type="text"
                className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500 text-lg font-medium"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Contoh: Tentang Kami"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Konten (Markdown/HTML Support)
              </label>
              <textarea
                className="w-full rounded-lg border-gray-200 p-4 border focus:ring-primary-500 focus:border-primary-500 font-serif"
                rows={20}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Tuliskan isi halaman di sini..."
              ></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Publishing
            </h3>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                URL Slug
              </label>
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-1 italic">
                <span>yourdomain.com/p/</span>
              </div>
              <input
                type="text"
                className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value.toLowerCase().replace(/ /g, "-"),
                  })
                }
                placeholder="tentang-kami"
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="is_published"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={formData.is_published}
                onChange={(e) =>
                  setFormData({ ...formData, is_published: e.target.checked })
                }
              />
              <label
                htmlFor="is_published"
                className="text-sm font-medium text-gray-700"
              >
                Terbitkan Segera
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              SEO Metadata
            </h3>
            <p className="text-xs text-gray-500 italic">
              Fitur optimasi mesin pencari akan segera hadir.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
