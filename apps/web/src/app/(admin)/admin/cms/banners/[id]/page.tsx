import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { BannerForm } from "@/components/features/admin/BannerForm";
import { adminCmsService } from "@/services/adminCmsService";

export default async function BannerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const banner = await adminCmsService.getBanner(parseInt(id), token);
  if (!banner) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Edit Banner: {banner.title}
      </h1>
      <BannerForm initialData={banner} />
    </div>
  );
}
