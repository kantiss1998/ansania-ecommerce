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

interface CustomerLTV {
  user_id: number;
  full_name: string;
  email: string;
  lifetime_value: number;
  total_orders: number;
  avg_order_value: number;
  first_order_date: string;
  last_order_date: string;
  customer_age_days: number;
}

export default function AdminCustomerLTVClient() {
  const [customers, setCustomers] = useState<CustomerLTV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [segment, setSegment] = useState<"all" | "high" | "medium" | "low">(
    "all",
  );

  const fetchCustomerLTV = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ data: CustomerLTV[] }>(
        `/admin/reports/customers/ltv${segment !== "all" ? `?segment=${segment}` : ""}`,
      );
      setCustomers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch customer LTV:", error);
    } finally {
      setIsLoading(false);
    }
  }, [segment]);

  useEffect(() => {
    fetchCustomerLTV();
  }, [fetchCustomerLTV]);

  const avgLTV =
    customers.length > 0
      ? customers.reduce((sum, c) => sum + c.lifetime_value, 0) /
        customers.length
      : 0;

  const totalLTV = customers.reduce((sum, c) => sum + c.lifetime_value, 0);

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
              Customer Lifetime Value (LTV)
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Analisis nilai pelanggan sepanjang waktu
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={segment === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => setSegment("all")}
            >
              Semua
            </Button>
            <Button
              variant={segment === "high" ? "primary" : "outline"}
              size="sm"
              onClick={() => setSegment("high")}
            >
              High Value
            </Button>
            <Button
              variant={segment === "medium" ? "primary" : "outline"}
              size="sm"
              onClick={() => setSegment("medium")}
            >
              Medium Value
            </Button>
            <Button
              variant={segment === "low" ? "primary" : "outline"}
              size="sm"
              onClick={() => setSegment("low")}
            >
              Low Value
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Average LTV</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            Rp {avgLTV.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Total LTV</p>
          <p className="mt-2 text-3xl font-bold text-primary-600">
            Rp {totalLTV.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Lifetime Value</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Avg Order Value</TableHead>
              <TableHead>Customer Age</TableHead>
              <TableHead>LTV/Day</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer) => {
                const ltvPerDay =
                  customer.customer_age_days > 0
                    ? customer.lifetime_value / customer.customer_age_days
                    : 0;

                return (
                  <TableRow key={customer.user_id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {customer.full_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {customer.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary-600">
                        Rp {customer.lifetime_value.toLocaleString("id-ID")}
                      </span>
                    </TableCell>
                    <TableCell>{customer.total_orders}</TableCell>
                    <TableCell>
                      Rp {customer.avg_order_value.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {customer.customer_age_days} hari
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      Rp{" "}
                      {ltvPerDay.toLocaleString("id-ID", {
                        maximumFractionDigits: 0,
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Link href={`/admin/customers/${customer.user_id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
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
