import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';

export default function Dashboard() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const q = query(
      collection(db, 'orders'), 
      where('userId', '==', user.id)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Can sort client-side easily if created at might be an object
      data.sort((a: any, b: any) => {
         const ta = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : a.createdAt;
         const tb = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : b.createdAt;
         return tb - ta;
      });
      setOrders(data);
    }, (error) => console.error(error));

    return () => unsub();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 bg-white p-6 rounded shadow-sm h-fit">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Hello, {user.name}</h2>
            <p className="text-gray-600 text-sm mb-6">{user.email}</p>
            <ul className="space-y-3">
              <li><a href="#" className="text-red-600 font-semibold">My Orders</a></li>
              <li><a href="#" className="text-gray-600 hover:text-red-600">My Returns</a></li>
              <li><a href="#" className="text-gray-600 hover:text-red-600">My Cancellations</a></li>
              <li><a href="#" className="text-gray-600 hover:text-red-600">My Wishlist</a></li>
            </ul>
            <button onClick={() => { logout(); navigate('/'); }} className="w-full mt-8 text-center text-sm text-gray-600 hover:text-red-600 font-medium">Log Out</button>
          </div>

          <div className="flex-1 bg-white p-6 rounded shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Recent Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500 py-4">You have no orders yet.</p>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="border border-gray-200 rounded p-4">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b">
                      <div>
                        <span className="font-mono text-sm font-bold text-gray-900 mr-4">Order #{order.id}</span>
                        <span className="text-sm text-gray-500">{new Date(order.createdAt?.seconds ? order.createdAt.seconds * 1000 : order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </div>
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center mb-2">
                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded mr-4" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="mt-4 pt-2 border-t flex justify-end text-sm">
                      <span className="text-gray-600 mr-4">Total:</span>
                      <span className="font-bold text-red-600 text-lg">৳{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
