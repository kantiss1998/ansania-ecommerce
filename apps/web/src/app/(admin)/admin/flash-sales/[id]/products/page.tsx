import AdminFlashSaleProductsClient from "./client";

export const dynamic = "force-dynamic";

export default async function AdminFlashSaleProductsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <AdminFlashSaleProductsClient flashSaleId={parseInt(id)} />
    </div>
  );
}
