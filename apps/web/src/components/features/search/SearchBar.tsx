'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';


export function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex w-full items-center gap-2 group">
            <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 transition-colors group-focus-within:text-primary-600">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                    type="search"
                    className="block w-full rounded-full border border-gray-200 bg-gray-50/50 p-2.5 pl-11 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 shadow-sm"
                    placeholder="Cari produk..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <Button
                type="submit"
                variant="primary"
                size="sm"
                className="hidden md:flex items-center gap-2 rounded-full px-5 shadow-lg shadow-primary-500/20"
            >
                <Search className="h-4 w-4" />
                Cari
            </Button>
        </form>
    );
}
