import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import type { Product } from '../store/cartStore';
import { db } from '../firebase';
import { collection, query as fsQuery, where, getDocs } from 'firebase/firestore';

export default function ProductListing() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const queryParam = searchParams.get('q');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [sort, setSort] = useState('relevance');

  useEffect(() => {
    getDocs(collection(db, 'categories')).then(snapshot => {
      setCategories(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  useEffect(() => {
    let q = fsQuery(collection(db, 'products'));
    if (categoryId) {
      q = fsQuery(collection(db, 'products'), where('categoryId', '==', categoryId));
    }
    
    getDocs(q).then(snapshot => {
      let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      
      if (queryParam) {
        data = data.filter(p => p.name.toLowerCase().includes(queryParam.toLowerCase()) || p.brand.toLowerCase().includes(queryParam.toLowerCase()));
      }

      if (sort === 'price_asc') data.sort((a, b) => a.price - b.price);
      if (sort === 'price_desc') data.sort((a, b) => b.price - a.price);
      
      setProducts(data);
    });
  }, [categoryId, queryParam, sort]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 bg-white p-4 rounded shadow-sm h-fit">
          <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Categories</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/products" className={`block text-sm ${!categoryId ? 'text-red-600 font-semibold' : 'text-gray-600 hover:text-red-500'}`}>
                All Products
              </Link>
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <Link 
                  to={`/products?category=${cat.id}`}
                  className={`block text-sm ${categoryId === cat.id ? 'text-red-600 font-semibold' : 'text-gray-600 hover:text-red-500'}`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white p-4 rounded shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {queryParam ? `Search results for "${queryParam}"` : 'All Products'} 
              <span className="text-gray-500 text-sm font-normal ml-2">({products.length} items found)</span>
            </h2>
            <div className="mt-4 sm:mt-0 flex items-center">
              <label className="text-sm text-gray-600 mr-2">Sort By:</label>
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-red-500"
              >
                <option value="relevance">Best Match</option>
                <option value="price_asc">Price Low to High</option>
                <option value="price_desc">Price High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
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
            {products.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                No products found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
