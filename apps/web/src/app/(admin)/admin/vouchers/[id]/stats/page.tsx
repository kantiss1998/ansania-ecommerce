import AdminVoucherStatsClient from "./client";

export const dynamic = "force-dynamic";

export default async function AdminVoucherStatsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <AdminVoucherStatsClient voucherId={parseInt(id)} />
    </div>
  );
}
