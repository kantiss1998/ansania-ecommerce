'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    // Generate page numbers to display
    // Simple logic for now: show all or a subset
    // Improvement: Logic to show [1, ..., 4, 5, 6, ..., 10]
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
        Math.max(0, currentPage - 3),
        Math.min(totalPages, currentPage + 2)
    );

    return (
        <div className={cn('flex justify-center gap-2', className)}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </Button>

            {pages[0] > 1 && (
                <>
                    <Button
                        variant={currentPage === 1 ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => onPageChange(1)}
                    >
                        1
                    </Button>
                    {pages[0] > 2 && <span className="flex items-center px-2">...</span>}
                </>
            )}

            {pages.map((page) => (
                <Button
                    key={page}
                    variant={page === currentPage ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Button>
            ))}

            {pages[pages.length - 1] < totalPages && (
                <>
                    {pages[pages.length - 1] < totalPages - 1 && (
                        <span className="flex items-center px-2">...</span>
                    )}
                    <Button
                        variant={currentPage === totalPages ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => onPageChange(totalPages)}
                    >
                        {totalPages}
                    </Button>
                </>
            )}

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </Button>
        </div>
    );
}
