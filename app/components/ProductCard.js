"use client";
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="product-card glass-card">
            {/* Placeholder for image, could generate one later if requested */}
            <div className="product-image-placeholder">
                <span>{product.category}</span>
            </div>

            <div className="product-content">
                <div className="product-meta">
                    <span className="brand">{product.brand}</span>
                </div>
                <h3 className="title">{product.name}</h3>
                <div className="price-row">
                    <span className="price">${product.price}</span>
                    <span className="stock">{product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
                </div>

                <button
                    onClick={() => addToCart(product)}
                    className="btn btn-primary add-btn"
                    disabled={product.stock_quantity <= 0}
                >
                    {product.stock_quantity > 0 ? 'Add to Cart' : 'Sold Out'}
                </button>
            </div>

            <style jsx>{`
        .product-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          position: relative;
        }
        .product-image-placeholder {
          height: 200px;
          background: linear-gradient(135deg, hsl(var(--muted)), hsl(var(--card)));
          display: flex;
          align-items: center;
          justify-content: center;
          color: hsl(var(--muted-foreground));
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .product-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .product-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }
        .brand {
            font-size: 0.75rem;
             color: hsl(var(--accent));
             font-weight: 600;
             text-transform: uppercase;
             letter-spacing: 0.05em;
        }
        .title {
            font-size: 1.1rem;
            margin-bottom: 1rem;
            line-height: 1.4;
            flex: 1;
        }
        .price-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        .price {
            font-size: 1.25rem;
            font-weight: 700;
            color: hsl(var(--foreground));
        }
        .stock {
            font-size: 0.75rem;
            color: hsl(var(--muted-foreground));
        }
        .add-btn {
            width: 100%;
            margin-top: auto;
        }
      `}</style>
        </div>
    );
}
