import { Suspense } from "react";

import { SearchResults } from "@/components/features/search/SearchResults";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-12 text-center text-gray-400">
          Mencari produk...
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
