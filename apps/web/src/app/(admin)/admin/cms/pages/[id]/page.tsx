import { notFound } from "next/navigation";

import { CMSPageForm } from "@/components/features/admin/CMSPageForm";
import { adminCmsService } from "@/services/adminCmsService";

export default async function PageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await adminCmsService.getPage(parseInt(id));
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <CMSPageForm initialData={page} />
    </div>
  );
}
