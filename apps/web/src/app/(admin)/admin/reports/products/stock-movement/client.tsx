'use client';

import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import apiClient from '@/lib/api';

interface StockMovement {
    product_id: number;
    product_name: string;
    sku: string;
    opening_stock: number;
    stock_in: number;
    stock_out: number;
    closing_stock: number;
    movement_rate: number;
}

export default function AdminStockMovementClient() {
    const [data, setData] = useState<StockMovement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<'7days' | '30days' | '90days'>('30days');

    useEffect(() => {
        fetchStockMovement();
    }, [period]);

    const fetchStockMovement = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<{ data: StockMovement[] }>(
                `/admin/reports/products/stock-movement?period=${period}`
            );
            setData(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch stock movement:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalStockOut = data.reduce((sum, item) => sum + item.stock_out, 0);
    const totalStockIn = data.reduce((sum, item) => sum + item.stock_in, 0);

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
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Stock Movement Report</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Pergerakan stok masuk dan keluar
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={period === '7days' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('7days')}
                        >
                            7 Hari
                        </Button>
                        <Button
                            variant={period === '30days' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('30days')}
                        >
                            30 Hari
                        </Button>
                        <Button
                            variant={period === '90days' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('90days')}
                        >
                            90 Hari
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">Total Stock In</p>
                    <p className="mt-2 text-3xl font-bold text-success-600">
                        +{totalStockIn.toLocaleString('id-ID')}
                    </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">Total Stock Out</p>
                    <p className="mt-2 text-3xl font-bold text-error-600">
                        -{totalStockOut.toLocaleString('id-ID')}
                    </p>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>SKU</TableHead>
                            <TableHead>Produk</TableHead>
                            <TableHead>Opening Stock</TableHead>
                            <TableHead>Stock In</TableHead>
                            <TableHead>Stock Out</TableHead>
                            <TableHead>Closing Stock</TableHead>
                            <TableHead>Movement Rate</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((item) => (
                                <TableRow key={item.product_id}>
                                    <TableCell>
                                        <span className="font-mono text-sm">{item.sku}</span>
                                    </TableCell>
                                    <TableCell className="font-medium">{item.product_name}</TableCell>
                                    <TableCell>{item.opening_stock}</TableCell>
                                    <TableCell>
                                        <span className="text-success-600">+{item.stock_in}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-error-600">-{item.stock_out}</span>
                                    </TableCell>
                                    <TableCell className="font-semibold">{item.closing_stock}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            item.movement_rate > 80 ? 'success' :
                                                item.movement_rate > 50 ? 'warning' :
                                                    'error'
                                        }>
                                            {item.movement_rate.toFixed(1)}%
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center text-gray-500">
                                    Tidak ada pergerakan stok.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
