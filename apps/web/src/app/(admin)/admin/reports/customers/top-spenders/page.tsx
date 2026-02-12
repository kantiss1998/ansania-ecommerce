import AdminTopSpendersClient from "./client";

export const dynamic = "force-dynamic";

export default function AdminTopSpendersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <AdminTopSpendersClient />
    </div>
  );
}
