"use client";

import { PaginatedResponse } from "@repo/shared";
import { Activity, Loader2, ClipboardList } from "lucide-react";
import { Suspense } from "react";

import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

interface ActivityLog {
  id: number;
  created_at: string;
  user?: { full_name: string };
  action: string;
  entity_type: string;
  entity_id?: string;
  status: string;
  ip_address?: string;
}

interface AdminActivityLogsClientProps {
  initialData: PaginatedResponse<ActivityLog> | null;
}

function AdminActivityLogsContent({
  initialData,
}: AdminActivityLogsClientProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-50 to-zinc-50 px-5 py-2.5 shadow-sm border border-slate-100/50 mb-4">
          <Activity className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-semibold text-slate-700">
            System Monitoring
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 bg-clip-text text-transparent font-heading">
          Activity Logs
        </h2>
        <p className="mt-3 text-base text-gray-600">
          Audit Trail: Pantau seluruh aktivitas administrator dan sistem
        </p>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waktu</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Aksi</TableHead>
              <TableHead>Entitas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData?.items && initialData.items.length > 0 ? (
              initialData.items.map((log: ActivityLog) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {log.user?.full_name || "System"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{log.action}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <span className="font-semibold">{log.entity_type}</span>{" "}
                    {log.entity_id ? `#${log.entity_id}` : ""}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={log.status === "success" ? "success" : "error"}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-400">
                    {log.ip_address || "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <ClipboardList className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base font-medium text-gray-600">
                    Tidak ada data log aktivitas.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function AdminActivityLogsClient({
  initialData,
}: AdminActivityLogsClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-slate-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Memuat audit trail...
            </p>
          </div>
        </div>
      }
    >
      <AdminActivityLogsContent initialData={initialData} />
    </Suspense>
  );
}
