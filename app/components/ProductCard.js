"use client";
import { useCart } from '../context/CartContext';
import { useChat } from '../context/ChatContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { openChat } = useChat();

    return (
        <div className="product-card glass-card">
            {/* Placeholder for image, could generate one later if requested */}
            <div className="product-image-placeholder">
                <span>{product.category}</span>
                <div className="card-actions">
                    <button
                        className="action-btn risk-btn"
                        onClick={() => openChat({
                            title: `Risk Assessment: ${product.name}`,
                            initialQuery: `Is ${product.name} risky to buy?`,
                            agentType: 'RISK'
                        })}
                        title="Assess Risk with AI"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </button>
                    <button
                        className="action-btn qna-btn"
                        onClick={() => openChat({
                            title: `Product Q&A: ${product.name}`,
                            initialQuery: `Tell me about ${product.name}`,
                            agentType: 'PRODUCT'
                        })}
                        title="Ask Questions about Product"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <path d="M12 17h.01" />
                        </svg>
                    </button>
                </div>
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
          position: relative;
        }
        .card-actions {
            position: absolute;
            top: 10px;
            right: 10px;
            display: flex;
            gap: 0.5rem;
            z-index: 10;
        }
        .action-btn {
            background: rgba(0,0,0,0.5);
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }
        .action-btn:hover {
            background: rgba(0,0,0,0.8);
            transform: scale(1.1);
        }
        .risk-btn {
            color: hsl(var(--destructive));
        }
        .qna-btn {
            color: hsl(var(--primary));
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
