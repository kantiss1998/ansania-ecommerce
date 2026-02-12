import AdminStockMovementClient from "./client";

export const dynamic = "force-dynamic";

export default function AdminStockMovementPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <AdminStockMovementClient />
    </div>
  );
}
