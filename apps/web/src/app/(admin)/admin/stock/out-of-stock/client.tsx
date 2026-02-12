"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

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

interface StockItem {
  id: number;
  product_id: number;
  sku: string;
  name: string;
  color?: string;
  size?: string;
  stock: number;
  last_sync_at: string;
}

export default function AdminOutOfStockClient() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOutOfStock();
  }, []);

  const fetchOutOfStock = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ data: { items: StockItem[] } }>(
        "/admin/stock/out-of-stock",
      );
      setItems(response.data.data?.items || []);
    } catch (error) {
      console.error("Failed to fetch out of stock:", error);
    } finally {
      setIsLoading(false);
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
          <h2 className="text-xl font-semibold text-gray-900">Out of Stock</h2>
          <p className="mt-1 text-sm text-gray-600">
            Produk yang habis dan tidak tersedia untuk dijual
          </p>
        </div>
        <Link href="/admin/stock">
          <Button variant="outline">← Kembali ke Stock</Button>
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Varian</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Sync</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className="font-mono text-sm">{item.sku}</span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {item.color && (
                        <span className="mr-2">Color: {item.color}</span>
                      )}
                      {item.size && <span>Size: {item.size}</span>}
                      {!item.color && !item.size && (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="error">Habis</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(item.last_sync_at).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Link href={`/admin/products/${item.product_id}`}>
                        <Button variant="outline" size="sm">
                          Lihat Produk
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
                  Semua produk tersedia dalam stok.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
