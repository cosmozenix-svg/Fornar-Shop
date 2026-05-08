import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { auth, db } from '../../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firebaseErrors';

export default function AdminLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuthStore();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const adminRef = doc(db, 'admins', user.uid);
      let isAdmin = false;
      try {
        const adminSnap = await getDoc(adminRef);
        isAdmin = adminSnap.exists();
      } catch (err: any) {
        // We handle missing permissions specifically if we try to read /admins
        if (err.message && err.message.includes('missing or insufficient permissions')) {
            isAdmin = false;
        } else {
            handleFirestoreError(err, OperationType.GET, 'admins');
        }
      }

      if (!isAdmin) {
        throw new Error('Not authorized as admin. Access denied.');
      }

      const token = await user.getIdToken();
      adminLogin(token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">FORNAR ADMIN SECURE PORTAL</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          {error && <div className="bg-red-900/50 text-red-400 border border-red-500/50 p-3 rounded text-sm mb-4">{error}</div>}
          <button 
            disabled={loading} 
            onClick={handleGoogleSignIn} 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
          >
            {loading ? 'Authenticating...' : 'Sign in as Admin with Google'}
          </button>
        </div>
      </div>
    </div>
  );
}
