"use client";

import { PaginatedResponse } from "@repo/shared";
import { EMAIL_STATUS } from "@repo/shared/constants";
import { Mail, Trash2, RotateCw, Loader2, Inbox } from "lucide-react";
import { Suspense } from "react";

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

interface Email {
  id: number;
  created_at: string;
  recipient_email: string;
  subject: string;
  template_name: string;
  status: string;
  retry_count: number;
}

interface AdminEmailQueueClientProps {
  initialData: PaginatedResponse<Email> | null;
}

function AdminEmailQueueContent({ initialData }: AdminEmailQueueClientProps) {
  const handleRetry = async (id: number) => {
    // Logic to retry email sending would go here
    alert("Retry request sent for email ID " + id);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-50 to-purple-50 px-5 py-2.5 shadow-sm border border-violet-100/50 mb-4">
              <Mail className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-semibold text-violet-700">
                Email System
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Email Queue
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Monitor status pengiriman email sistem (transaksional, otp,
              promosi)
            </p>
          </div>
          <Button variant="outline" size="md" className="rounded-2xl">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Sent Logs
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waktu Antre</TableHead>
              <TableHead>Penerima</TableHead>
              <TableHead>Subjek</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData?.items && initialData.items.length > 0 ? (
              initialData.items.map((email) => (
                <TableRow key={email.id}>
                  <TableCell className="text-xs text-gray-500">
                    {new Date(email.created_at).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {email.recipient_email}
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-600 max-w-xs truncate"
                    title={email.subject}
                  >
                    {email.subject}
                  </TableCell>
                  <TableCell>
                    <code className="text-[10px] bg-gray-100 px-1 py-0.5 rounded italic">
                      {email.template_name}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        email.status === EMAIL_STATUS.SENT
                          ? "success"
                          : email.status === EMAIL_STATUS.PENDING
                            ? "info"
                            : "error"
                      }
                    >
                      {email.status}
                    </Badge>
                    {email.retry_count > 0 && (
                      <span className="ml-2 text-[10px] text-gray-400">
                        ({email.retry_count} retries)
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {email.status !== EMAIL_STATUS.SENT && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => handleRetry(email.id)}
                      >
                        <RotateCw className="mr-1.5 h-3.5 w-3.5" />
                        Retry
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <Inbox className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base font-medium text-gray-600">
                    Tidak ada data antrean email.
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

export default function AdminEmailQueueClient({
  initialData,
}: AdminEmailQueueClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-violet-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Memuat antrean email...
            </p>
          </div>
        </div>
      }
    >
      <AdminEmailQueueContent initialData={initialData} />
    </Suspense>
  );
}
