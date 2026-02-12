"use client";

import { FlashSale, FlashSaleItem } from "@repo/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { getAccessToken } from "@/lib/auth";

interface FlashSaleFormProps {
  initialData?: FlashSale;
}

interface ProductInput {
  id: number;
  name: string;
  selling_price: number;
}

export function FlashSaleForm({ initialData }: FlashSaleFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<FlashSale>>(
    initialData || {
      name: "",
      description: "",
      start_date: new Date().toISOString().split("T")[0] + "T00:00",
      end_date:
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0] +
        "T23:59",
      is_active: false,
      products: [],
    },
  );

  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const token = getAccessToken();
      const method = isEdit ? "PUT" : "POST";
      const endpoint = isEdit
        ? `/api/admin/flash-sales/${initialData.id}`
        : "/api/admin/flash-sales";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${endpoint}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        router.push("/admin/flash-sales");
        router.refresh();
      } else {
        alert("Gagal menyimpan flash sale.");
      }
    } catch (error) {
      console.error("Submit flash sale error:", error);
      alert("Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = (product: ProductInput) => {
    const newItem: Partial<FlashSaleItem> = {
      product_id: product.id,
      original_price: product.selling_price,
      flash_sale_price: product.selling_price * 0.8, // Default 20% discount
      stock_limit: 10,
      sold_count: 0,
      product: { name: product.name } as unknown as FlashSaleItem["product"], // Mock product for display
      is_active: true,
    };
    setFormData({
      ...formData,
      products: [...(formData.products || []), newItem as FlashSaleItem],
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...(formData.products || [])];
    newItems.splice(index, 1);
    setFormData({ ...formData, products: newItems });
  };

  const updateItem = (
    index: number,
    field: keyof FlashSaleItem,
    value: string | number,
  ) => {
    const newItems = [...(formData.products || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, products: newItems });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit
              ? `Edit Flash Sale: ${initialData.name}`
              : "Buat Program Flash Sale"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Atur jadwal flash sale dan produk yang dilibatkan
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
            {isEdit ? "Simpan Perubahan" : "Mulai Flash Sale"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <main className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 border-b pb-2">
              Daftar Produk Flash Sale
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-4 py-3">Produk</th>
                    <th className="px-4 py-3">Harga Promo</th>
                    <th className="px-4 py-3">Kuota Stok</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {formData.products?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">
                          {item.product?.name || "Produk"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="number"
                          className="w-32 rounded-lg border-gray-200 p-2 text-sm border"
                          value={item.flash_sale_price}
                          onChange={(e) =>
                            updateItem(
                              idx,
                              "flash_sale_price",
                              Number(e.target.value),
                            )
                          }
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="number"
                          className="w-24 rounded-lg border-gray-200 p-2 text-sm border"
                          value={item.stock_limit}
                          onChange={(e) =>
                            updateItem(
                              idx,
                              "stock_limit",
                              Number(e.target.value),
                            )
                          }
                        />
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-error-600"
                          onClick={() => removeItem(idx)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!formData.products || formData.products.length === 0) && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 text-center text-gray-400 italic"
                      >
                        Belum ada produk yang ditambahkan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed"
                onClick={() =>
                  handleAddItem({
                    id: 1,
                    name: "Contoh Produk",
                    selling_price: 150000,
                  })
                }
              >
                + Tambah Produk ke Flash Sale
              </Button>
            </div>
          </div>
        </main>

        <aside className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Jadwal & Status
            </h3>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Nama Event
              </label>
              <input
                type="text"
                className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Flash Sale Akhir Bulan"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Mulai</label>
              <input
                type="datetime-local"
                className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Berakhir
              </label>
              <input
                type="datetime-local"
                className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="is_active"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
              />
              <label
                htmlFor="is_active"
                className="text-sm font-medium text-gray-700"
              >
                Publikasikan Event
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-warning-200 bg-warning-50 p-6 space-y-2">
            <h4 className="text-sm font-bold text-warning-800">Perhatian</h4>
            <p className="text-xs text-warning-700 leading-relaxed">
              Flash sale akan menggantikan harga reguler produk selama periode
              berlangsung. Pastikan kuota stok cukup untuk menghindari
              over-selling.
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}
