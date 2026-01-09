"use client";
import { useCart } from '../context/CartContext';

export default function Cart() {
    const { cartItems, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (!isCartOpen) return null;

    return (
        <>
            <div className="cart-overlay" onClick={toggleCart}></div>
            <div className="cart-sidebar glass">
                <div className="cart-header">
                    <h2>Your Cart ({cartItems.length})</h2>
                    <button onClick={toggleCart} className="close-btn">&times;</button>
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <p className="empty-msg">Your cart is empty.</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.product_id} className="cart-item glass-card">
                                <div className="item-details">
                                    <h4>{item.name}</h4>
                                    <p className="item-price">${item.price}</p>
                                    <p className="item-brand">{item.brand}</p>
                                </div>
                                <div className="item-actions">
                                    <div className="qty-controls">
                                        <button onClick={() => updateQuantity(item.product_id, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product_id, 1)}>+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.product_id)} className="remove-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div className="total-row">
                        <span>Total</span>
                        <span className="total-amount">${parseFloat(cartTotal).toFixed(2)}</span>
                    </div>
                    <button className="btn btn-primary btn-block">Checkout</button>
                </div>
            </div>

            <style jsx>{`
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(2px);
          z-index: 90;
        }
        .cart-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 400px;
          background: hsl(var(--card));
          z-index: 100;
          display: flex;
          flex-direction: column;
          border-left: 1px solid hsl(var(--border) / 0.5);
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .cart-header {
          padding: 1.5rem;
          border-bottom: 1px solid hsl(var(--border));
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          color: hsl(var(--muted-foreground));
          cursor: pointer;
          line-height: 1;
        }
        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .cart-item {
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .item-details h4 {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        .item-price {
          color: hsl(var(--primary));
          font-weight: 600;
        }
        .item-brand {
            font-size: 0.7rem;
            color: hsl(var(--muted-foreground));
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .item-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }
        .qty-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: hsl(var(--muted));
          border-radius: var(--radius);
          padding: 0.1rem;
        }
        .qty-controls button {
          background: none;
          border: none;
          color: hsl(var(--foreground));
          width: 24px;
          height: 24px;
          cursor: pointer;
        }
        .remove-btn {
          background: none;
          border: none;
          color: hsl(var(--destructive));
          cursor: pointer;
          padding: 4px;
          opacity: 0.7;
        }
        .remove-btn:hover {
          opacity: 1;
        }
        .cart-footer {
          padding: 1.5rem;
          border-top: 1px solid hsl(var(--border));
          background: hsl(var(--card));
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .total-amount {
          color: hsl(var(--primary));
        }
        .btn-block {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
        }
        .empty-msg {
          text-align: center;
          color: hsl(var(--muted-foreground));
          margin-top: 2rem;
        }
      `}</style>
        </>
    );
}
