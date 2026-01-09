import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const customerId = searchParams.get('customerId');

        if (!customerId) {
            return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
        }

        // Fetch orders with their latest delivery status
        const ordersQuery = `
      SELECT 
        o.order_id, 
        o.order_date, 
        o.order_status, 
        o.total_amount, 
        o.payment_mode,
        d.delivery_status,
        d.current_location,
        d.expected_delivery_date,
        d.actual_delivery_date
      FROM orders o
      LEFT JOIN deliveries d ON o.order_id = d.order_id
      WHERE o.customer_id = $1
      ORDER BY o.order_date DESC
    `;

        const ordersResult = await pool.query(ordersQuery, [customerId]);
        const orders = ordersResult.rows;

        // For each order, fetch items
        for (let order of orders) {
            const itemsQuery = `
        SELECT oi.order_item_id, oi.quantity, oi.price, p.name as product_name, p.brand, p.category
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = $1
      `;
            const itemsResult = await pool.query(itemsQuery, [order.order_id]);
            order.items = itemsResult.rows;
        }

        return NextResponse.json(orders, { status: 200 });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
