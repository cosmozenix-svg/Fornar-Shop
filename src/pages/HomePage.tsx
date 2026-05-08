import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Product } from '../store/cartStore';
import { ChevronRight } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, limit, getDocs } from 'firebase/firestore';

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    getDocs(collection(db, 'categories')).then(snapshot => {
      setCategories(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    getDocs(query(collection(db, 'products'), limit(8))).then(snapshot => {
      setFeatured(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    });
  }, []);

  return (
    <div className="bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              100% Authentic Products <br/> at Best Prices
            </h1>
            <p className="text-red-100 text-lg mb-8">
              Discover millions of products from verified sellers across Bangladesh.
            </p>
            <Link to="/products" className="inline-block bg-white text-red-600 font-semibold px-8 py-3 rounded shadow hover:bg-gray-100 transition">
              Shop Now
            </Link>
          </div>
          <div className="hidden md:block">
            <img src="https://placehold.co/600x400/D00000/FFF?text=Fornar+Shopping" alt="Hero" className="rounded-lg shadow-xl" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Categories */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
            <Link to="/products" className="text-red-600 font-medium hover:underline flex items-center">
              View All <ChevronRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map(cat => (
              <Link to={`/products?category=${cat.id}`} key={cat.id} className="bg-white rounded shadow-sm hover:shadow-md transition p-4 text-center group cursor-pointer block">
                <img src={cat.imageUrl} alt={cat.name} className="w-full h-32 object-cover rounded mb-4" />
                <h3 className="font-medium text-gray-800 group-hover:text-red-600 transition">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Just For You</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map(product => (
              <Link to={`/products/${product.id}`} key={product.id} className="bg-white rounded shadow-sm hover:shadow-md transition overflow-hidden group flex flex-col">
                <div className="relative pt-[100%]">
                  <img src={product.imageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-sm text-gray-800 line-clamp-2 mb-2 flex-grow group-hover:text-red-600">{product.name}</h3>
                  <div className="mt-auto">
                    <span className="text-lg font-bold text-red-600">৳{product.price.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
