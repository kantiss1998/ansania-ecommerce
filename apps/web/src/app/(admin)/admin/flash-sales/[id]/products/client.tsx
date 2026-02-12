"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import apiClient from "@/lib/api";

interface FlashSaleProduct {
  id: number;
  product_id: number;
  flash_sale_id: number;
  discount_percentage: number;
  stock_limit: number;
  sold_count: number;
  product?: {
    name: string;
    slug: string;
    price: number;
    image?: string;
  };
}

interface AdminFlashSaleProductsClientProps {
  flashSaleId: number;
}

export default function AdminFlashSaleProductsClient({
  flashSaleId,
}: AdminFlashSaleProductsClientProps) {
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    discount_percentage: "",
    stock_limit: "",
  });

  const fetchFlashSaleProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ data: FlashSaleProduct[] }>(
        `/admin/flash-sales/${flashSaleId}/products`,
      );
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch flash sale products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [flashSaleId]);

  useEffect(() => {
    fetchFlashSaleProducts();
  }, [flashSaleId, fetchFlashSaleProducts]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await apiClient.post(`/admin/flash-sales/${flashSaleId}/products`, {
        product_id: parseInt(formData.product_id),
        discount_percentage: parseFloat(formData.discount_percentage),
        stock_limit: parseInt(formData.stock_limit),
      });
      setShowAddForm(false);
      setFormData({ product_id: "", discount_percentage: "", stock_limit: "" });
      fetchFlashSaleProducts();
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Gagal menambahkan produk ke flash sale");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveProduct = async (productId: number) => {
    if (!confirm("Hapus produk dari flash sale?")) return;

    try {
      await apiClient.delete(
        `/admin/flash-sales/${flashSaleId}/products/${productId}`,
      );
      fetchFlashSaleProducts();
    } catch (error) {
      console.error("Failed to remove product:", error);
      alert("Gagal menghapus produk");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Flash Sale Products
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Kelola produk yang termasuk dalam flash sale ini
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/flash-sales/${flashSaleId}`}>
            <Button variant="outline">← Kembali</Button>
          </Link>
          <Button
            variant="primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Batal" : "+ Tambah Produk"}
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tambah Produk ke Flash Sale
          </h3>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product ID
                </label>
                <input
                  type="number"
                  required
                  value={formData.product_id}
                  onChange={(e) =>
                    setFormData({ ...formData, product_id: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                  placeholder="ID Produk"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discount (%)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="99"
                  value={formData.discount_percentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_percentage: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                  placeholder="Contoh: 50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock Limit
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.stock_limit}
                  onChange={(e) =>
                    setFormData({ ...formData, stock_limit: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                  placeholder="Jumlah stok"
                />
              </div>
            </div>
            <Button type="submit" variant="primary" isLoading={isAdding}>
              Tambahkan Produk
            </Button>
          </form>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Harga Normal</TableHead>
              <TableHead>Diskon</TableHead>
              <TableHead>Harga Flash Sale</TableHead>
              <TableHead>Stock Limit</TableHead>
              <TableHead>Terjual</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((item) => {
                const normalPrice = item.product?.price || 0;
                const discountedPrice =
                  normalPrice * (1 - item.discount_percentage / 100);
                const soldPercentage =
                  (item.sold_count / item.stock_limit) * 100;

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.product?.image && (
                          <Image
                            src={item.product.image}
                            alt={item.product?.name || ""}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded object-cover border border-gray-100"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.product?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.product?.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      Rp {normalPrice.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="error">
                        -{item.discount_percentage}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary-600">
                        Rp {discountedPrice.toLocaleString("id-ID")}
                      </span>
                    </TableCell>
                    <TableCell>{item.stock_limit}</TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">{item.sold_count}</span>
                        <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-primary-600"
                            style={{
                              width: `${Math.min(soldPercentage, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.sold_count >= item.stock_limit ? (
                        <Badge variant="error">Habis</Badge>
                      ) : soldPercentage >= 80 ? (
                        <Badge variant="warning">Hampir Habis</Badge>
                      ) : (
                        <Badge variant="success">Tersedia</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Link href={`/admin/products/${item.product_id}`}>
                          <Button variant="outline" size="sm">
                            Lihat
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-error-600 hover:bg-error-50"
                          onClick={() => handleRemoveProduct(item.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-12 text-center text-gray-500"
                >
                  Belum ada produk dalam flash sale ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
