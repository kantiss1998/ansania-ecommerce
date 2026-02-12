"use client";

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

interface TopSpender {
  user_id: number;
  full_name: string;
  email: string;
  total_spent: number;
  total_orders: number;
  avg_order_value: number;
  last_order_date: string;
}

export default function AdminTopSpendersClient() {
  const [spenders, setSpenders] = useState<TopSpender[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(50);

  const fetchTopSpenders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ data: TopSpender[] }>(
        `/admin/reports/customers/top-spenders?limit=${limit}`,
      );
      setSpenders(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch top spenders:", error);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTopSpenders();
  }, [fetchTopSpenders]);

  const totalRevenue = spenders.reduce((sum, s) => sum + s.total_spent, 0);

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
              Top Spenders
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Pelanggan dengan total pembelian tertinggi
            </p>
          </div>
          <div className="flex gap-2">
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="rounded-lg border border-gray-300 p-2"
            >
              <option value={10}>Top 10</option>
              <option value={25}>Top 25</option>
              <option value={50}>Top 50</option>
              <option value={100}>Top 100</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Total Revenue from Top {limit}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          Rp {totalRevenue.toLocaleString("id-ID")}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Avg Order Value</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spenders.length > 0 ? (
              spenders.map((spender, idx) => (
                <TableRow key={spender.user_id}>
                  <TableCell className="font-bold text-gray-400">
                    #{idx + 1}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">
                        {spender.full_name}
                      </p>
                      <p className="text-xs text-gray-500">{spender.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-primary-600">
                      Rp {spender.total_spent.toLocaleString("id-ID")}
                    </span>
                  </TableCell>
                  <TableCell>{spender.total_orders}</TableCell>
                  <TableCell>
                    Rp {spender.avg_order_value.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(spender.last_order_date).toLocaleDateString(
                      "id-ID",
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Link href={`/admin/customers/${spender.user_id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-gray-500"
                >
                  Tidak ada data pelanggan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
