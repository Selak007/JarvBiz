"use client";
import { useEffect, useState, Suspense } from 'react';
import { useAuth } from './context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from './components/ProductCard';
import SearchBox from './components/SearchBox';

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth Guard
    const storedUser = localStorage.getItem('jarvibiz_user');
    if (!storedUser && !user) {
      router.push('/login');
      return;
    }

    const currentUser = user || JSON.parse(storedUser);

    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/api/products';

        if (searchQuery) {
          url += `?search=${encodeURIComponent(searchQuery)}`;
        } else if (currentUser) {
          // Fetch personalized recommendations
          url += `?recommendations_for=${currentUser.customer_id}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user, router, searchQuery]);

  if (loading) {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading your personalized experience...</div>;
  }

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div className="dashboard-header glass-card" style={{ marginBottom: '2rem', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1rem' }}>Welcome Back, {user.name}</h1>
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>
          {searchQuery ? `Results for "${searchQuery}"` : "Here are some exclusive picks just for you based on your unique style."}
        </p>
      </div>

      <SearchBox />

      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.product_id} product={product} />
          ))
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', width: '100%' }}>No products found.</p>
        )}
      </div>

      <style jsx>{`
         .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2rem;
         }
      `}</style>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
