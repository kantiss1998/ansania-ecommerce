import AdminAbandonedCartsClient from "./client";

export const dynamic = "force-dynamic";

export default function AdminAbandonedCartsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AdminAbandonedCartsClient />
    </div>
  );
}
