import pool from '@/lib/db';
import ProductCard from '../../components/ProductCard';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AddToCartButton from '../../components/AddToCartButton';

// Fetch product directly from DB
async function getProduct(id) {
    try {
        const query = 'SELECT * FROM products WHERE product_id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export default async function ProductPage({ params }) {
    const product = await getProduct(params.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '2rem', color: 'hsl(var(--muted-foreground))' }}>
                &larr; Back to Shop
            </Link>

            <div className="product-detail glass-card">
                <div className="detail-image">
                    {/* Placeholder */}
                    <span>{product.category}</span>
                </div>

                <div className="detail-content">
                    <span className="detail-brand">{product.brand}</span>
                    <h1 className="detail-title">{product.name}</h1>
                    <p className="detail-price">${product.price}</p>

                    <div className="detail-meta">
                        <span className="badge">Stock: {product.stock_quantity}</span>
                        <span className="badge">Category: {product.category}</span>
                    </div>

                    <div className="description">
                        <p>Experience the premium quality of {product.brand}. This {product.name} is designed for those who appreciate fine craftsmanship and style.</p>
                    </div>

                    <div className="actions">
                        {/* Reuse the Add to Cart logic via client component wrapper or just the card?
                     Actually ProductCard has the logic but it's a card. 
                     I should probably make a standalone AddToCart button or just reuse ProductCard visuals?
                     Better: Extract AddToCart Button or just inline a client component here.
                     For speed, I'll use a Client Component for the button.
                  */}
                        <AddToCartButton product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}
