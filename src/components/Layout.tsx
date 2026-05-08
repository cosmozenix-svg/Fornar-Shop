import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function Layout() {
  const cartItems = useCartStore(state => state.items);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      setAllProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, console.error);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const queryLower = searchQuery.toLowerCase();
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(queryLower) || 
        (p.brand && p.brand.toLowerCase().includes(queryLower))
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsSearchFocused(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 mr-2 md:hidden text-gray-600 hover:text-red-600"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/" className="text-2xl font-bold tracking-tight text-red-600">
                Fornar
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-2xl px-8" ref={searchContainerRef}>
              <form onSubmit={handleSearch} className="w-full relative">
                <input
                  type="text"
                  placeholder="Search in Fornar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-full py-2 pl-4 pr-10 outline-none transition-all"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-gray-500 hover:text-red-600">
                  <Search size={20} />
                </button>
                {isSearchFocused && suggestions.length > 0 && (
                  <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50">
                    <ul className="flex flex-col">
                      {suggestions.map((product) => (
                        <li key={product.id}>
                          <Link
                            to={`/product/${product.id}`}
                            className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                            onClick={() => { setIsSearchFocused(false); setSearchQuery(''); }}
                          >
                            <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded mr-3" />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</span>
                              <span className="text-xs text-gray-500">{product.brand}</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </form>
            </div>

            {/* Right Nav */}
            <div className="flex items-center space-x-6">
              {user ? (
                <div className="relative group">
                  <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-red-600">
                    <User size={24} className="mr-1" />
                    <span className="hidden md:block text-sm font-medium">{user.name}</span>
                  </Link>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-red-600 hidden md:block">
                  Login / Sign Up
                </Link>
              )}
              
              <Link to="/cart" className="flex items-center text-gray-600 hover:text-red-600 relative">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu & Search */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-gray-100 rounded-full py-2 pl-4 pr-10 outline-none"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-500">
                <Search size={20} />
              </button>
              {isSearchFocused && suggestions.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50">
                  <ul className="flex flex-col">
                    {suggestions.map((product) => (
                      <li key={product.id}>
                        <Link
                          to={`/product/${product.id}`}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                          onClick={() => { setIsSearchFocused(false); setIsMobileMenuOpen(false); setSearchQuery(''); }}
                        >
                          <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded mr-3" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</span>
                            <span className="text-xs text-gray-500">{product.brand}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
            <div className="flex flex-col space-y-3 pt-2">
              <Link to="/products" className="text-gray-800 font-medium font-sans" onClick={() => setIsMobileMenuOpen(false)}>All Products</Link>
              {!user && <Link to="/login" className="text-gray-800 font-medium font-sans" onClick={() => setIsMobileMenuOpen(false)}>Login / Sign Up</Link>}
              {user && (
                <>
                  <Link to="/dashboard" className="text-gray-800 font-medium font-sans" onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-left text-red-600 font-medium font-sans">Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-[#1D1D1D] text-gray-300 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4 font-sans text-red-500">Fornar</h3>
            <p className="text-sm border-t border-gray-800 pt-4">Your daily shopping destination in Bangladesh. Quality products, fast delivery.</p>
          </div>
          <div>
            <h4 className="text-white text-md font-semibold mb-4 font-sans">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-red-400">Help Center</Link></li>
              <li><Link to="#" className="hover:text-red-400">How to Buy</Link></li>
              <li><Link to="#" className="hover:text-red-400">Returns & Refunds</Link></li>
              <li><Link to="#" className="hover:text-red-400">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-md font-semibold mb-4 font-sans">Fornar</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-red-400">About Us</Link></li>
              <li><Link to="#" className="hover:text-red-400">Careers</Link></li>
              <li><Link to="#" className="hover:text-red-400">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-red-400">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-md font-semibold mb-4 font-sans">Payment Methods</h4>
            <div className="flex space-x-2 text-sm text-gray-400">
              <span className="px-2 py-1 bg-gray-800 rounded">bKash</span>
              <span className="px-2 py-1 bg-gray-800 rounded">Nagad</span>
              <span className="px-2 py-1 bg-gray-800 rounded">COD</span>
            </div>
          </div>
        </div>
        <div className="text-center text-sm mt-12 text-gray-500 border-t border-gray-800 pt-8 max-w-7xl mx-auto">
          &copy; {new Date().getFullYear()} Fornar. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
