"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useChat } from '../context/ChatContext';

export default function OrdersPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { openChat } = useChat();
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
                    {orders.map(order => {
                        const status = order.delivery_status || order.order_status;
                        const isDelayed = status === 'DELAYED' || status === 'Delayed';
                        return (
                            <div key={order.order_id} className="order-card glass-card">
                                <div className="order-header">
                                    <div>
                                        {/* <h3>Order #{order.order_id}</h3> */}
                                        <span className="order-date">{new Date(order.order_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="order-status-group">
                                        <div className={`order-status-badge ${isDelayed ? 'delayed' : ''}`}>
                                            {status}
                                        </div>
                                        {isDelayed && (
                                            <button
                                                className="help-btn"
                                                onClick={() => openChat({
                                                    title: `Delivery Support`,
                                                    initialQuery: `My order ${order.order_id} has been delayed. Can you help me with the status?`,
                                                    initialDisplay: `My order has been delayed. Can you help me with the status?`,
                                                    agentType: 'DELIVERY'
                                                })}
                                                title="Ask about delay"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                                            </button>
                                        )}
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

                                            <button
                                                className="refund-btn"
                                                onClick={() => openChat({
                                                    title: `Refund Request: ${item.product_name}`,
                                                    agentType: 'REFUND',
                                                    metaData: {
                                                        customer_id: user.customer_id,
                                                        order_id: order.order_id,
                                                        order_item_id: item.order_item_id
                                                    }
                                                })}
                                            >
                                                Refund
                                            </button>
                                            <button
                                                className="complaint-btn"
                                                onClick={() => openChat({
                                                    title: `Complaint: ${item.product_name}`,
                                                    agentType: 'COMPLAINT',
                                                    metaData: {
                                                        customer_id: user.customer_id,
                                                        order_id: order.order_id,
                                                        order_item_id: item.order_item_id
                                                    }
                                                })}
                                            >
                                                Complaint
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <span>Total Amount</span>
                                    <span className="total-price">${order.total_amount}</span>
                                </div>
                            </div>
                        )
                    })}
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
        .order-status-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
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
        .order-status-badge.delayed {
            background: hsl(var(--destructive) / 0.2);
            color: hsl(var(--destructive));
        }
        .help-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            background: hsl(var(--secondary));
            color: hsl(var(--secondary-foreground));
            border: 1px solid hsl(var(--border));
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .help-btn:hover {
            background: hsl(var(--primary));
            color: white;
            transform: scale(1.1);
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
            position: relative;
            padding: 0.5rem;
            border-radius: 0.5rem;
            transition: background 0.2s;
        }
        .order-item:hover {
            background: hsl(var(--muted) / 0.3);
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
        .refund-btn {
            opacity: 0;
            background: hsl(var(--destructive));
            color: white;
            border: none;
            padding: 0.25rem 0.75rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.2s;
            margin-left: 1rem;
            transform: translateX(10px);
        }
        .order-item:hover .refund-btn, .order-item:hover .complaint-btn {
            opacity: 1;
            transform: translateX(0);
        }
        .complaint-btn {
            opacity: 0;
            background: hsl(var(--destructive)); /* Red for complaint too? Or maybe orange? User said "similar to previous refund agent". Let's use warning/orange color or just standard button. */
            /* Actually, refund is destructive (red). Complaint might be better as warning or secondary. */
            background: #f59e0b; /* Amber-500 */
            color: white;
            border: none;
            padding: 0.25rem 0.75rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.2s;
            margin-left: 0.5rem;
            transform: translateX(10px);
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
