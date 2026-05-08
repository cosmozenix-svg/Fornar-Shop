import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firebaseErrors';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>({});

  useEffect(() => {
    const unsubProds = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, error => handleFirestoreError(error, OperationType.GET, 'products'));

    const unsubCats = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, error => handleFirestoreError(error, OperationType.GET, 'categories'));

    return () => {
      unsubProds();
      unsubCats();
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProduct.id) {
        const prodRef = doc(db, 'products', currentProduct.id);
        const data = { ...currentProduct };
        delete data.id;
        await updateDoc(prodRef, data);
      } else {
        const newId = 'p' + Date.now();
        await setDoc(doc(db, 'products', newId), {
          ...currentProduct,
          price: Number(currentProduct.price),
          stock: Number(currentProduct.stock),
        });
      }
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Products</h2>
        <button 
          onClick={() => { setIsEditing(true); setCurrentProduct({ categoryId: categories[0]?.id }); }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Add Product
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h3 className="text-lg font-bold mb-4">{currentProduct.id ? 'Edit' : 'Add'} Product</h3>
          <form onSubmit={handleSave} className="space-y-4 grid md:grid-cols-2 gap-4">
            <div className="col-span-full md:col-span-1 mt-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input required value={currentProduct.name || ''} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input required value={currentProduct.brand || ''} onChange={e => setCurrentProduct({...currentProduct, brand: e.target.value})} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (৳)</label>
              <input required type="number" value={currentProduct.price || ''} onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input required type="number" value={currentProduct.stock || ''} onChange={e => setCurrentProduct({...currentProduct, stock: Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select required value={currentProduct.categoryId || ''} onChange={e => setCurrentProduct({...currentProduct, categoryId: e.target.value})} className="w-full border rounded px-3 py-2 bg-white">
                <option value="">Select a Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input required value={currentProduct.imageUrl || ''} onChange={e => setCurrentProduct({...currentProduct, imageUrl: e.target.value})} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea required value={currentProduct.description || ''} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full border rounded px-3 py-2" rows={3}></textarea>
            </div>
            <div className="col-span-full flex justify-end space-x-2">
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 font-medium">Image</th>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Stock</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><img src={product.imageUrl} alt="" className="w-12 h-12 object-cover rounded" /></td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">৳{product.price}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => { setCurrentProduct(product); setIsEditing(true); }} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
