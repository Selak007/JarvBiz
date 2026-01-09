import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const query = `
      SELECT customer_id, name, email, phone, city, state, customer_type 
      FROM customers 
      WHERE email = $1 AND password = $2
    `;

        // Note: In a real app, use hashing. Here we compare plain text as per schema/instructions.
        const result = await pool.query(query, [email, password]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const user = result.rows[0];

        return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
