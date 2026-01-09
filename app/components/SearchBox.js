"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBox() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }
            try {
                const res = await fetch(`/api/products?type=suggestions&search=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data);
                }
            } catch (err) {
                console.error("Error fetching suggestions:", err);
            }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        search(query);
    };

    const search = (term) => {
        if (term.trim()) {
            router.push(`/?search=${encodeURIComponent(term)}`);
            setShowSuggestions(false);
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (item) => {
        setQuery(item.name);
        search(item.name);
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearch} className="search-box">
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onFocus={() => setShowSuggestions(true)}
                    className="search-input"
                    autoComplete="off"
                />
                <button type="submit" className="search-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list glass-card">
                    {suggestions.map((item, index) => (
                        <li key={index} onClick={() => handleSelectSuggestion(item)} className="suggestion-item">
                            <span className="suggestion-name">{item.name}</span>
                            <span className="suggestion-brand">{item.brand}</span>
                        </li>
                    ))}
                </ul>
            )}

            <style jsx>{`
                .search-container {
                    position: relative;
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto 2rem;
                    z-index: 50;
                }
                .search-box {
                    display: flex;
                    align-items: center;
                    background: hsl(var(--muted));
                    border-radius: var(--radius);
                    padding: 0.5rem;
                    width: 100%;
                    border: 1px solid transparent;
                    transition: border-color 0.2s;
                }
                .search-box:focus-within {
                    border-color: hsl(var(--primary));
                    box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2);
                }
                .search-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: hsl(var(--foreground));
                    padding: 0.5rem;
                    outline: none;
                }
                .search-btn {
                    background: hsl(var(--primary));
                    border: none;
                    color: white;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .search-btn:hover {
                    background: hsl(var(--primary) / 0.9);
                }
                .suggestions-list {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    margin-top: 0.5rem;
                    list-style: none;
                    padding: 0;
                    overflow: hidden;
                }
                .suggestion-item {
                    padding: 0.75rem 1rem;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid hsl(var(--border) / 0.5);
                    transition: background 0.2s;
                }
                .suggestion-item:last-child {
                    border-bottom: none;
                }
                .suggestion-item:hover {
                    background: hsl(var(--muted));
                }
                .suggestion-name {
                    font-weight: 500;
                }
                .suggestion-brand {
                    font-size: 0.75rem;
                    color: hsl(var(--muted-foreground));
                    text-transform: uppercase;
                }
            `}</style>
        </div>
    );
}
