import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../firebase';
import { collection, onSnapshot, getDocs, doc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firebaseErrors';

export default function AdminDashboard() {
  const { adminToken } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Generate stats
    const fetchStats = async () => {
      try {
        const [usersSnap, productsSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'products'))
        ]);
        
        let totalRevenue = 0;
        orders.forEach(o => {
          if (o.status === 'Delivered') totalRevenue += o.total;
        });

        setStats({
          totalProducts: productsSnap.size,
          totalUsers: usersSnap.size,
          totalOrders: orders.length,
          revenue: totalRevenue
        });
      } catch (err) {
        console.error(err);
      }
    };
    if (orders.length >= 0) fetchStats();
  }, [orders]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'orders'), snapshot => {
      let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a: any, b: any) => {
         const ta = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : a.createdAt;
         const tb = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : b.createdAt;
         return tb - ta;
      });
      setOrders(data);
    }, error => handleFirestoreError(error, OperationType.GET, 'orders'));
    return () => unsub();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Summary</h2>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded shadow-sm p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase mb-1">Total Products</h3>
            <span className="text-3xl font-bold text-gray-900">{stats.totalProducts}</span>
          </div>
          <div className="bg-white rounded shadow-sm p-6 border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase mb-1">Total Orders</h3>
            <span className="text-3xl font-bold text-gray-900">{stats.totalOrders}</span>
          </div>
          <div className="bg-white rounded shadow-sm p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase mb-1">Total Users</h3>
            <span className="text-3xl font-bold text-gray-900">{stats.totalUsers}</span>
          </div>
          <div className="bg-white rounded shadow-sm p-6 border-l-4 border-red-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase mb-1">Total Revenue</h3>
            <span className="text-3xl font-bold text-gray-900">৳{stats.revenue.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Recent Orders (Manage)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Payment</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders placed yet.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-sm">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.createdAt?.seconds ? order.createdAt.seconds * 1000 : order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-medium">৳{order.total.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.paymentMethod}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-bold 
                        \${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        \${order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : ''}
                        \${order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' : ''}
                        \${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                        \${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status} 
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-red-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
