"use client";

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

interface MonthlySalesData {
  month: string;
  year: number;
  total_orders: number;
  total_revenue: number;
  total_items: number;
}

export default function AdminMonthlySalesClient() {
  const [data, setData] = useState<MonthlySalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchMonthlySales = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ data: MonthlySalesData[] }>(
        `/admin/reports/sales/monthly?year=${year}`,
      );
      setData(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch monthly sales:", error);
    } finally {
      setIsLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchMonthlySales();
  }, [fetchMonthlySales]);

  const totalRevenue = data.reduce((sum, item) => sum + item.total_revenue, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.total_orders, 0);

  const handleExport = () => {
    const csv = [
      ["Month", "Year", "Total Orders", "Total Revenue", "Total Items"].join(
        ",",
      ),
      ...data.map((row) =>
        [
          row.month,
          row.year,
          row.total_orders,
          row.total_revenue,
          row.total_items,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `monthly-sales-${year}.csv`;
    a.click();
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
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Monthly Sales Report
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Laporan penjualan bulanan
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-lg border border-gray-300 p-2"
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={handleExport}>
              📥 Export CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Total Revenue ({year})</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Total Orders ({year})</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalOrders.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Total Revenue</TableHead>
              <TableHead>Total Items</TableHead>
              <TableHead>Avg Order Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">
                    {row.month} {row.year}
                  </TableCell>
                  <TableCell>{row.total_orders}</TableCell>
                  <TableCell>
                    Rp {row.total_revenue.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>{row.total_items}</TableCell>
                  <TableCell>
                    Rp{" "}
                    {row.total_orders > 0
                      ? (row.total_revenue / row.total_orders).toLocaleString(
                          "id-ID",
                          { maximumFractionDigits: 0 },
                        )
                      : 0}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-gray-500"
                >
                  Tidak ada data penjualan untuk tahun ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
