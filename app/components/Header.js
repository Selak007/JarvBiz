"use client";
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
    const { user, logout } = useAuth();
    const { toggleCart, cartCount } = useCart();

    return (
        <header className="fixed-header glass">
            <div className="container header-content">
                <Link href="/" className="logo">
                    JARVIBIZ
                </Link>

                <nav className="nav-links">
                    <Link href="/" className="nav-link">Shop</Link>
                    {user && <Link href="/orders" className="nav-link">Orders</Link>}
                </nav>

                <div className="header-actions">
                    {user ? (
                        <div className="user-menu">
                            <span className="user-name">Hi, {user.name}</span>
                            <button onClick={logout} className="btn btn-secondary btn-sm">Logout</button>
                        </div>
                    ) : (
                        <Link href="/login" className="btn btn-primary btn-sm">Login</Link>
                    )}

                    <button onClick={toggleCart} className="cart-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </button>
                </div>
            </div>

            <style jsx>{`
        .fixed-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 4rem;
          z-index: 50;
          display: flex;
          align-items: center;
        }
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .logo {
          font-weight: 900;
          font-size: 1.5rem;
          color: hsl(var(--foreground));
          letter-spacing: -0.05em;
          text-transform: uppercase;
          background: linear-gradient(to right, #fff, #bbb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        .nav-link {
          font-weight: 500;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .nav-link:hover {
          opacity: 1;
          color: hsl(var(--primary));
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .user-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-name {
          font-size: 0.875rem;
          opacity: 0.8;
        }
        .btn-sm {
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
        }
        .cart-btn {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          transition: transform 0.2s;
        }
        .cart-btn:hover {
          transform: scale(1.1);
          color: hsl(var(--primary));
        }
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: hsl(var(--primary));
          color: white;
          font-size: 0.7rem;
          font-weight: bold;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid hsl(var(--background));
        }
      `}</style>
        </header>
    );
}
