import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmation() {
  const { id } = useParams();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm text-center">
        <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-4" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <div className="bg-gray-50 p-4 rounded mb-8 text-left">
          <p className="text-sm text-gray-600 mb-1">Order ID:</p>
          <p className="font-mono font-bold text-gray-900">{id}</p>
        </div>
        <Link 
          to="/products"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
