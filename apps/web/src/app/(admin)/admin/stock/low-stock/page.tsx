import AdminLowStockClient from "./client";

export const dynamic = "force-dynamic";

export default function AdminLowStockPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <AdminLowStockClient />
    </div>
  );
}
