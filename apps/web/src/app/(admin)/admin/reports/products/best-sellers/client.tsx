"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

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

interface BestSellerProduct {
  product_id: number;
  product_name: string;
  product_slug: string;
  product_image?: string;
  total_sold: number;
  total_revenue: number;
}

export default function AdminBestSellersClient() {
  const [products, setProducts] = useState<BestSellerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"7days" | "30days" | "90days" | "all">(
    "30days",
  );

  const fetchBestSellers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ data: BestSellerProduct[] }>(
        `/admin/reports/products/best-sellers?period=${period}`,
      );
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch best sellers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchBestSellers();
  }, [period, fetchBestSellers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Best Sellers
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Produk terlaris berdasarkan jumlah penjualan
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={period === "7days" ? "primary" : "outline"}
              size="sm"
              onClick={() => setPeriod("7days")}
            >
              7 Hari
            </Button>
            <Button
              variant={period === "30days" ? "primary" : "outline"}
              size="sm"
              onClick={() => setPeriod("30days")}
            >
              30 Hari
            </Button>
            <Button
              variant={period === "90days" ? "primary" : "outline"}
              size="sm"
              onClick={() => setPeriod("90days")}
            >
              90 Hari
            </Button>
            <Button
              variant={period === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => setPeriod("all")}
            >
              Semua
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead>Total Terjual</TableHead>
              <TableHead>Total Revenue</TableHead>
              <TableHead>Avg Price</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product, idx) => (
                <TableRow key={product.product_id}>
                  <TableCell className="font-bold text-gray-400">
                    #{idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.product_image && (
                        <Image
                          src={product.product_image}
                          alt={product.product_name || ""}
                          width={48}
                          height={48}
                          className="rounded object-cover border border-gray-100"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.product_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.product_slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-primary-600">
                      {product.total_sold} unit
                    </span>
                  </TableCell>
                  <TableCell>
                    Rp {product.total_revenue.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    Rp{" "}
                    {(
                      product.total_revenue / product.total_sold
                    ).toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Link href={`/admin/products/${product.product_id}`}>
                        <Button variant="outline" size="sm">
                          Lihat Detail
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-gray-500"
                >
                  Tidak ada data penjualan produk.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
