import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebaseErrors';

export default function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({ fullName: '', address: '', city: 'Dhaka', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const deliveryFee = shipping.city === 'Dhaka' ? 60 : 120;
  const grandTotal = total() + deliveryFee;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderId = 'o' + Date.now();
      const orderData = {
        userId: user.id,
        items,
        shipping,
        paymentMethod,
        total: grandTotal,
        status: 'Pending',
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'orders', orderId), orderData);
      
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'orders');
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="bg-white p-6 rounded shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">1. Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input required type="text" value={shipping.fullName} onChange={(e) => setShipping({...shipping, fullName: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input required type="tel" value={shipping.phone} onChange={(e) => setShipping({...shipping, phone: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select required value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-red-500 bg-white">
                    <option value="Dhaka">Dhaka (৳60)</option>
                    <option value="Chittagong">Chittagong (৳120)</option>
                    <option value="Sylhet">Sylhet (৳120)</option>
                    <option value="Rajshahi">Rajshahi (৳120)</option>
                    <option value="Other">Other City (৳120)</option>
                  </select>
                </div>
                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Address</label>
                  <textarea required rows={3} value={shipping.address} onChange={(e) => setShipping({...shipping, address: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-red-500"></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">2. Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer border p-3 rounded hover:border-red-500 transition">
                  <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-red-600 focus:ring-red-500 w-4 h-4" />
                  <span className="ml-3 font-medium text-gray-800">Cash on Delivery</span>
                </label>
                <label className="flex items-center cursor-pointer border p-3 rounded hover:border-red-500 transition">
                  <input type="radio" value="bKash" checked={paymentMethod === 'bKash'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-red-600 focus:ring-red-500 w-4 h-4" />
                  <span className="ml-3 font-medium text-gray-800">bKash (Simulation)</span>
                </label>
                <label className="flex items-center cursor-pointer border p-3 rounded hover:border-red-500 transition">
                  <input type="radio" value="Nagad" checked={paymentMethod === 'Nagad'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-red-600 focus:ring-red-500 w-4 h-4" />
                  <span className="ml-3 font-medium text-gray-800">Nagad (Simulation)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white p-6 rounded shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 line-clamp-1 mr-4">{item.quantity}x {item.name}</span>
                    <span className="text-gray-900 font-medium whitespace-nowrap">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>৳{total().toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                  <span>Delivery ({shipping.city})</span>
                  <span>৳{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-4 text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-red-600">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>
              {error && <p className="text-red-600 text-sm mt-4 bg-red-50 p-2 rounded">{error}</p>}
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full mt-6 text-white font-bold py-3 rounded shadow transition ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {loading ? 'Processing...' : 'PLACE ORDER'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
