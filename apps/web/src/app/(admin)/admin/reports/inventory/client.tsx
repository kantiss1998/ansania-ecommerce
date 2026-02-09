'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import apiClient from '@/lib/api';

interface InventoryItem {
    product_id: number;
    product_name: string;
    sku: string;
    category: string;
    current_stock: number;
    reserved_stock: number;
    available_stock: number;
    stock_value: number;
    reorder_point: number;
    status: 'healthy' | 'low' | 'critical' | 'out_of_stock';
}

export default function AdminInventoryReportClient() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<{ data: InventoryItem[] }>('/admin/reports/inventory');
            setInventory(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalStockValue = inventory.reduce((sum, item) => sum + item.stock_value, 0);
    const totalItems = inventory.reduce((sum, item) => sum + item.current_stock, 0);
    const lowStockItems = inventory.filter(i => i.status === 'low' || i.status === 'critical').length;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">Inventory Report</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Overview lengkap inventori dan nilai stok
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">Total Stock Value</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        Rp {totalStockValue.toLocaleString('id-ID')}
                    </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">Total Items</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {totalItems.toLocaleString('id-ID')}
                    </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">Low Stock Items</p>
                    <p className="mt-2 text-3xl font-bold text-error-600">
                        {lowStockItems}
                    </p>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>SKU</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Current Stock</TableHead>
                            <TableHead>Reserved</TableHead>
                            <TableHead>Available</TableHead>
                            <TableHead>Stock Value</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventory.length > 0 ? (
                            inventory.map((item) => (
                                <TableRow key={item.product_id}>
                                    <TableCell>
                                        <span className="font-mono text-sm">{item.sku}</span>
                                    </TableCell>
                                    <TableCell className="font-medium">{item.product_name}</TableCell>
                                    <TableCell className="text-sm text-gray-600">{item.category}</TableCell>
                                    <TableCell>{item.current_stock}</TableCell>
                                    <TableCell className="text-warning-600">{item.reserved_stock}</TableCell>
                                    <TableCell className="font-semibold">{item.available_stock}</TableCell>
                                    <TableCell>
                                        Rp {item.stock_value.toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            item.status === 'healthy' ? 'success' :
                                                item.status === 'low' ? 'warning' :
                                                    item.status === 'critical' ? 'error' :
                                                        'default'
                                        }>
                                            {item.status === 'healthy' ? 'Healthy' :
                                                item.status === 'low' ? 'Low Stock' :
                                                    item.status === 'critical' ? 'Critical' :
                                                        'Out of Stock'
                                            }
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="py-12 text-center text-gray-500">
                                    Tidak ada data inventori.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
