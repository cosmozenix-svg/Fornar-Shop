import { useCartStore } from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12">
        <div className="bg-white p-8 rounded shadow-sm text-center max-w-md w-full">
          <img src="https://placehold.co/200x200?text=Empty+Cart" alt="Empty Cart" className="mx-auto mb-6 rounded-full" />
          <h2 className="text-xl font-bold mb-4 text-gray-800">Your cart is empty</h2>
          <Link to="/products" className="inline-block bg-red-600 text-white font-semibold px-6 py-2 rounded hover:bg-red-700 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart ({items.length} items)</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-6 gap-4 p-4 text-sm text-gray-500 border-b border-gray-100 uppercase font-bold text-center items-center">
                <div className="col-span-3 text-left">Item</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Subtotal</div>
              </div>
              
              <ul className="divide-y divide-gray-100">
                {items.map(item => (
                  <li key={item.id} className="p-4 flex flex-col md:grid md:grid-cols-6 gap-4 items-center text-center">
                    <div className="col-span-3 flex items-center w-full min-w-0">
                      <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
                      <div className="text-left w-full min-w-0">
                        <Link to={`/products/${item.id}`} className="font-medium text-gray-800 hover:text-red-600 line-clamp-2 block mb-1">
                          {item.name}
                        </Link>
                        <span className="text-sm text-gray-500">{item.brand}</span>
                      </div>
                    </div>
                    
                    <div className="hidden md:block text-red-600 font-medium">৳{item.price.toLocaleString()}</div>
                    
                    <div className="w-full md:w-auto flex justify-center mt-4 md:mt-0">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 bg-gray-100 text-gray-600"
                        >-</button>
                        <span className="px-4 py-1 border-x border-gray-300 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                          className="px-3 py-1 bg-gray-100 text-gray-600"
                        >+</button>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-auto flex justify-between md:justify-center items-center mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0">
                      <span className="md:hidden text-sm text-gray-500 font-medium">Subtotal:</span>
                      <div className="text-red-600 font-bold">৳{(item.price * item.quantity).toLocaleString()}</div>
                      <button onClick={() => removeItem(item.id)} className="md:ml-4 text-gray-400 hover:text-red-600 transition">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Order Summary</h2>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Subtotal</span>
                <span>৳{total().toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600">Calculated next</span>
              </div>
              <div className="flex justify-between mb-6 text-lg font-bold text-gray-800 border-t pt-4">
                <span>Total</span>
                <span className="text-red-600">৳{total().toLocaleString()}</span>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-red-600 text-white font-bold py-3 rounded shadow hover:bg-red-700 transition"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
