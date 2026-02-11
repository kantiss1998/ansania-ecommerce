'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { adminCustomerService, CustomerStats, CustomerActivity } from '@/services/adminCustomerService';

interface AdminCustomerDetailClientProps {
    customerId: number;
}

export default function AdminCustomerDetailClient({ customerId }: AdminCustomerDetailClientProps) {
    const [stats, setStats] = useState<CustomerStats | null>(null);
    const [activities, setActivities] = useState<CustomerActivity[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'stats' | 'activity' | 'reviews'>('stats');
    const [isBlocked, setIsBlocked] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchCustomerData();
    }, [customerId]);

    const fetchCustomerData = async () => {
        setIsLoading(true);
        try {
            const [statsData, activityData, reviewsData] = await Promise.all([
                adminCustomerService.getCustomerStats(customerId),
                adminCustomerService.getCustomerActivity(customerId),
                adminCustomerService.getCustomerReviews(customerId)
            ]);
            setStats(statsData);
            setActivities(activityData);
            setReviews(reviewsData);
            // Assume we get blocked status from stats or a separate call
            setIsBlocked(statsData.is_blocked || false);
        } catch (error) {
            console.error('Failed to fetch customer data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleBlockCustomer = async () => {
        const action = isBlocked ? 'unblock' : 'block';
        if (!confirm(`Are you sure you want to ${action} this customer?`)) {
            return;
        }

        setIsUpdating(true);
        try {
            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
            const response = await fetch(
                `${baseUrl}/admin/customers/${customerId}/${action}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${document.cookie.split('auth_token=')[1]?.split(';')[0]}`,
                    },
                }
            );

            if (response.ok) {
                setIsBlocked(!isBlocked);
                alert(`Customer ${action}ed successfully`);
            } else {
                alert(`Failed to ${action} customer`);
            }
        } catch (error) {
            console.error(`Failed to ${action} customer:`, error);
            alert('An error occurred');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    const StarRating = ({ rating }: { rating: number }) => {
        return (
            <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className={s <= rating ? 'fill-current' : 'text-gray-300'}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
                        {isBlocked && (
                            <Badge variant="error">BLOCKED</Badge>
                        )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                        Customer ID: #{customerId}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={isBlocked ? 'primary' : 'ghost'}
                        className={!isBlocked ? 'text-error-600 hover:bg-error-50' : ''}
                        onClick={toggleBlockCustomer}
                        isLoading={isUpdating}
                    >
                        {isBlocked ? '✓ Unblock Customer' : '🚫 Block Customer'}
                    </Button>
                    <Link href="/admin/customers">
                        <Button variant="outline">
                            ← Kembali ke Customers
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_orders}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-600">Total Spent</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            Rp {stats.total_spent.toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-600">Avg Order Value</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            Rp {stats.avg_order_value.toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-600">Reviews</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_reviews}</p>
                        {stats.avg_rating > 0 && (
                            <div className="mt-1 flex items-center gap-1">
                                <StarRating rating={Math.round(stats.avg_rating)} />
                                <span className="text-sm text-gray-500">({stats.avg_rating.toFixed(1)})</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200">
                    <div className="flex gap-4 px-6">
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'stats'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Statistics
                        </button>
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'activity'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Activity ({activities.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'reviews'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Reviews ({reviews.length})
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'stats' && stats && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">First Order</p>
                                    <p className="mt-1 text-gray-900">
                                        {stats.first_order_date
                                            ? new Date(stats.first_order_date).toLocaleDateString('id-ID')
                                            : '-'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Last Order</p>
                                    <p className="mt-1 text-gray-900">
                                        {stats.last_order_date
                                            ? new Date(stats.last_order_date).toLocaleDateString('id-ID')
                                            : '-'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activities.length > 0 ? (
                                    activities.map((activity) => (
                                        <TableRow key={activity.id}>
                                            <TableCell>
                                                <Badge variant={
                                                    activity.type === 'order' ? 'success' :
                                                        activity.type === 'review' ? 'warning' :
                                                            'default'
                                                }>
                                                    {activity.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{activity.description}</TableCell>
                                            <TableCell className="text-sm text-gray-500">
                                                {new Date(activity.created_at).toLocaleString('id-ID')}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="py-8 text-center text-gray-500">
                                            No activity found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="space-y-4">
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review.id} className="rounded-lg border border-gray-200 p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <StarRating rating={review.rating} />
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(review.created_at).toLocaleDateString('id-ID')}
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
                                                {review.product && (
                                                    <p className="mt-2 text-xs text-gray-500">
                                                        Product: {review.product.name}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge variant={
                                                review.status === 'approved' ? 'success' :
                                                    review.status === 'pending' ? 'warning' :
                                                        'error'
                                            }>
                                                {review.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="py-8 text-center text-gray-500">No reviews yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
