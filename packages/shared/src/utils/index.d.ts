export * from "./string";
export * from "./number";
export * from "./date";
export declare function generateOrderNumber(): string;
export declare function calculatePagination(page: number, limit: number, total: number): {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};
export declare function delay(ms: number): Promise<void>;
export declare function parsePhoneNumber(phone: string): string;
export declare function deepClone<T>(obj: T): T;
export declare function removeEmptyValues<T extends Record<string, unknown>>(obj: T): Partial<T>;
export declare function toCSV(data: Record<string, unknown>[]): string;
//# sourceMappingURL=index.d.ts.map