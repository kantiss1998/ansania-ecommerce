"use client";

import { Category } from "@repo/shared";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { adminProductService } from "@/services/adminProductService";
import { Product } from "@/services/productService";

interface ProductFormProps {
  initialData?: Product;
  categories: Category[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      name: "",
      slug: "",
      description: "",
      selling_price: 0,
      compare_price: 0,
      category: categories[0]
        ? {
          id: categories[0].id,
          name: categories[0].name,
          slug: categories[0].slug,
        }
        : undefined,
      is_featured: false,
      is_new: true,
      images: [],
      variants: [],
    },
  );

  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (isEdit && initialData.id) {
        await adminProductService.updateProduct(initialData.id, formData);
        success("Produk berhasil diperbarui.");
      } else {
        await adminProductService.createProduct(formData);
        success("Produk berhasil ditambahkan.");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Submit product error:", error);
      showError(
        error instanceof Error ? error.message : "Gagal menyimpan produk.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isEdit || !initialData?.id) {
      showError("Please save the product first before uploading images.");
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await adminProductService.uploadProductImage(
        initialData.id,
        file,
      );
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), imageUrl],
      }));
      success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      showError(
        error instanceof Error ? error.message : "Failed to upload image.",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the input to allow re-uploading the same file
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit
              ? `Edit Produk: ${initialData?.name}`
              : "Tambah Produk Baru"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Lengkapi informasi detail produk dan manajemen stok
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
            {isEdit ? "Update Produk" : "Simpan Produk"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Fixed Sidebar for Tabs */}
        <aside className="lg:w-48 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
          {["general", "stock", "images", "description"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-left rounded-lg text-sm font-medium transition-all ${activeTab === tab
                ? "bg-primary-50 text-primary-700 shadow-sm"
                : "text-gray-500 hover:bg-gray-100"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </aside>

        {/* Main Form Content */}
        <main className="flex-1 space-y-6">
          {activeTab === "general" && (
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-900 border-b pb-2">
                Informasi Umum
              </h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-300 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Category
                  </label>
                  <select
                    className="w-full rounded-lg border-gray-300 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                    value={formData.category?.id}
                    onChange={(e) => {
                      const catId = Number(e.target.value);
                      const cat = categories.find((c) => c.id === catId);
                      if (cat) {
                        setFormData({
                          ...formData,
                          category: {
                            id: cat.id,
                            name: cat.name,
                            slug: cat.slug,
                          },
                        });
                      }
                    }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Selling Price (Harga Jual)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border-gray-300 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                    value={formData.selling_price ?? formData.base_price ?? 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        selling_price: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Compare Price (Harga Coret)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border-gray-300 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                    value={formData.compare_price ?? formData.discount_price ?? 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        compare_price: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "stock" && (
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="font-bold text-gray-900 border-b pb-4 mb-6">
                Manajemen Varian & Stok
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Property</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {formData.variants?.map((v, i) => (
                      <tr key={v.id || i}>
                        <td className="px-4 py-3 text-gray-900">{v.sku}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-500">
                            {v.color} / {v.size}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {formatCurrency(v.price || 0)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={(v.stock || 0) > 0 ? "success" : "error"}
                          >
                            {v.stock || 0}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-gray-400 italic">
                Varian produk disinkronisasikan secara otomatis melalui Odoo
                ERP.
              </p>
            </div>
          )}

          {activeTab === "images" && (
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-900 border-b pb-2">
                Media Produk
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images?.filter(img => !!img).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50 group"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`Product image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-50 hover:text-red-500"
                        onClick={() => {
                          const newImgs = [...(formData.images || [])];
                          newImgs.splice(idx, 1);
                          setFormData({ ...formData, images: newImgs });
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  disabled={!isEdit || isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all ${!isEdit
                    ? "bg-gray-50 border-gray-100 cursor-not-allowed text-gray-300"
                    : "border-gray-200 text-gray-400 hover:border-primary-500 hover:text-primary-500"
                    }`}
                >
                  {isUploading ? (
                    <span className="text-[10px] font-medium animate-pulse">
                      Uploading...
                    </span>
                  ) : (
                    <>
                      <span className="text-2xl">+</span>
                      <span className="text-[10px] font-medium uppercase tracking-wider">
                        {isEdit ? "Add Image" : "Save Product first"}
                      </span>
                    </>
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          )}

          {activeTab === "description" && (
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 border-b pb-2">
                Deskripsi Lengkap
              </h3>
              <textarea
                className="w-full rounded-lg border-gray-300 p-4 border focus:ring-primary-500 focus:border-primary-500 font-sans"
                rows={12}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Tuliskan detail produk, bahan, and cara perawatan..."
              ></textarea>
            </div>
          )}
        </main>
      </div>
    </form>
  );
}
