import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const customerId = searchParams.get('recommendations_for');

        const queryType = searchParams.get('type');

        let query = 'SELECT * FROM products';
        let params = [];
        let conditions = [];

        // Suggestions Logic
        if (queryType === 'suggestions' && search) {
            // Return distinct names and brands that match
            const suggestionQuery = `
            SELECT DISTINCT name, brand FROM products 
            WHERE name ILIKE $1 OR brand ILIKE $1 
            ORDER BY name ASC 
            LIMIT 5
         `;
            const result = await pool.query(suggestionQuery, [`%${search}%`]);
            return NextResponse.json(result.rows, { status: 200 });
        }

        // Search Logic
        if (search) {
            conditions.push(`(name ILIKE $${params.length + 1} OR brand ILIKE $${params.length + 1} OR category ILIKE $${params.length + 1})`);
            params.push(`%${search}%`);
        }

        // Recommendation Logic
        if (customerId && !search) {
            // 1. Get user's preferred categories/brands from past orders
            const historyQuery = `
        SELECT DISTINCT p.category, p.brand
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE o.customer_id = $1
        LIMIT 10
      `;
            const historyResult = await pool.query(historyQuery, [customerId]);

            if (historyResult.rows.length > 0) {
                // Build a preference-based query
                // Since we are injecting raw strings for IN clause (safe if from DB, but risky if not sanitized), 
                // let's stick to a safer approach or just standard SQL params if possible. 
                // For simplicity with pg library variable substitution limitation for IN lists:
                // We will just fetch ALL products and filter/sort in Javascript if the dataset is small (it is).
                // OR better: use the params for basic filtering.

                // Actually, let's just create a weighted random sort or simple filter for now.
                // Reverting to a simpler robust query to avoid SQL injection risks with dynamic IN clauses manually built.

                // Revised Strategy:
                // Fetch products, boosted by category.
                query = `
            SELECT p.*, 
            CASE WHEN p.category = ANY($${params.length + 2}::text[]) THEN 1 ELSE 0 END as relevance
            FROM products p
            WHERE p.product_id NOT IN (
                SELECT product_id FROM order_items 
                JOIN orders ON order_items.order_id = orders.order_id 
                WHERE orders.customer_id = $${params.length + 1}
            )
            ORDER BY relevance DESC, random()
            LIMIT 6
        `;
                const categoryList = historyResult.rows.map(r => r.category);
                params.push(customerId);
                params.push(categoryList);

                const result = await pool.query(query, params);
                // Fallback if not enough recommendations
                if (result.rows.length < 6) {
                    const needed = 6 - result.rows.length;
                    const fallbackQuery = `SELECT * FROM products ORDER BY random() LIMIT $1`;
                    const fallbackResult = await pool.query(fallbackQuery, [needed]);
                    return NextResponse.json([...result.rows, ...fallbackResult.rows], { status: 200 });
                }
                return NextResponse.json(result.rows, { status: 200 });
            }

            // No history, return random 6
            query += ' ORDER BY random() LIMIT 6';
            const result = await pool.query(query, params);
            return NextResponse.json(result.rows, { status: 200 });
        }

        // Standard Search or List
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
            // Sort logic for search: Exact Start > Contains
            // Since we don't have complex extensions, we can order by length as a proxy for "closeness" if it's an exact match, 
            // but simpler is just standard string match. 
            // Let's just default order.
        }

        query += ' ORDER BY product_id ASC';

        const result = await pool.query(query, params);
        return NextResponse.json(result.rows, { status: 200 });

    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
