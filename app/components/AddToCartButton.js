"use client";
import { useCart } from '../context/CartContext';

export default function AddToCartButton({ product }) {
    const { addToCart } = useCart();

    return (
        <button
            onClick={() => addToCart(product)}
            className="btn btn-primary"
            style={{ padding: '1rem 2rem', fontSize: '1.25rem', width: '100%' }}
            disabled={product.stock_quantity <= 0}
        >
            {product.stock_quantity > 0 ? 'Add to Cart' : 'Sold Out'}
        </button>
    );
}
