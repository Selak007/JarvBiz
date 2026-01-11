import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ChatProvider } from './context/ChatContext';
import Cart from './components/Cart';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Jarvibiz | Premium E-Commerce',
  description: 'Experience the future of shopping.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ChatProvider>
            <CartProvider>
              <div className="layout-wrapper">
                <Header />
                <Cart />
                <main className="main-content">
                  {children}
                </main>
              </div>
            </CartProvider>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
