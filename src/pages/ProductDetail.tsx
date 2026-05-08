import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore, type Product } from '../store/cartStore';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, 'products', id))
      .then(snapshot => {
        if (!snapshot.exists()) throw new Error('Not found');
        setProduct({ id: snapshot.id, ...snapshot.data() } as Product);
      })
      .catch(() => navigate('/products'));
  }, [id, navigate]);

  if (!product) return <div className="min-h-screen pt-20 text-center">Loading...</div>;

  const handleAddToCart = () => {
    addItem(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded shadow-sm p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded overflow-hidden">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200 flex justify-between">
                <span>Brand: <span className="text-blue-600 cursor-pointer">{product.brand}</span></span>
              </div>
              
              <div className="text-3xl font-bold text-red-600 mb-6">
                ৳{product.price.toLocaleString()}
              </div>

              <div className="mb-6 flex items-center">
                <span className="text-gray-600 mr-4 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600"
                  >-</button>
                  <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600"
                  >+</button>
                </div>
                <span className="ml-4 text-sm text-gray-500">{product.stock} pieces available</span>
              </div>

              <div className="flex space-x-4 mb-8">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-red-600 text-white font-semibold py-3 rounded shadow hover:bg-red-700 transition"
                  disabled={product.stock === 0}
                >
                  Buy Now
                </button>
                <button 
                  onClick={() => addItem(product, quantity)}
                  className="flex-1 bg-red-100 text-red-600 font-semibold py-3 rounded hover:bg-red-200 transition"
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </button>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Product Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
