"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch(`/api/orders?customerId=${user.customer_id}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, router]);

    if (loading) {
        return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading orders...</div>;
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Your Orders</h1>

            {orders.length === 0 ? (
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.order_id} className="order-card glass-card">
                            <div className="order-header">
                                <div>
                                    <h3>Order #{order.order_id}</h3>
                                    <span className="order-date">{new Date(order.order_date).toLocaleDateString()}</span>
                                </div>
                                <div className="order-status-badge">
                                    {order.delivery_status || order.order_status}
                                </div>
                            </div>

                            <div className="delivery-info">
                                <div className="info-item">
                                    <span className="label">Status</span>
                                    <span className="value">{order.delivery_status || 'Processing'}</span>
                                </div>
                                {order.expected_delivery_date && (
                                    <div className="info-item">
                                        <span className="label">Expected Delivery</span>
                                        <span className="value">{new Date(order.expected_delivery_date).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {order.current_location && (
                                    <div className="info-item">
                                        <span className="label">Last Location</span>
                                        <span className="value">{order.current_location}</span>
                                    </div>
                                )}
                            </div>

                            <div className="order-items">
                                {order.items && order.items.map(item => (
                                    <div key={item.order_item_id} className="order-item">
                                        <span className="item-qty">{item.quantity}x</span>
                                        <div className="item-name">
                                            <span>{item.product_name}</span>
                                            <span className="item-brand">{item.brand}</span>
                                        </div>
                                        <span className="item-price">${item.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <span>Total Amount</span>
                                <span className="total-price">${order.total_amount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
        .orders-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        .order-card {
            padding: 1.5rem;
        }
        .order-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid hsl(var(--border));
        }
        .order-date {
            font-size: 0.875rem;
            color: hsl(var(--muted-foreground));
            display: block;
            margin-top: 0.25rem;
        }
        .order-status-badge {
            background: hsl(var(--primary) / 0.2);
            color: hsl(var(--primary));
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        .delivery-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            background: hsl(var(--muted) / 0.5);
            padding: 1rem;
            border-radius: var(--radius);
            margin-bottom: 1.5rem;
        }
        .info-item {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }
        .label {
            font-size: 0.75rem;
            color: hsl(var(--muted-foreground));
            text-transform: uppercase;
        }
        .value {
            font-size: 0.9rem;
            font-weight: 500;
        }
        .order-items {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
        }
        .order-item {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .item-qty {
            font-weight: 600;
            color: hsl(var(--muted-foreground));
            width: 30px;
        }
        .item-name {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        .item-brand {
            font-size: 0.75rem;
            color: hsl(var(--muted-foreground));
        }
        .order-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid hsl(var(--border));
            font-weight: 700;
        }
        .total-price {
            font-size: 1.25rem;
            color: hsl(var(--primary));
        }
      `}</style>
        </div>
    );
}
