import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firebaseErrors';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, error => handleFirestoreError(error, OperationType.GET, 'categories'));

    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentCategory.id) {
        const catRef = doc(db, 'categories', currentCategory.id);
        const data = { ...currentCategory };
        delete data.id;
        await updateDoc(catRef, data);
      } else {
        const newId = 'c' + Date.now();
        await setDoc(doc(db, 'categories', newId), currentCategory);
      }
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'categories');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteDoc(doc(db, 'categories', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Categories</h2>
        <button 
          onClick={() => { setIsEditing(true); setCurrentCategory({}); }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Add Category
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h3 className="text-lg font-bold mb-4">{currentCategory.id ? 'Edit' : 'Add'} Category</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input required value={currentCategory.name || ''} onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input required value={currentCategory.imageUrl || ''} onChange={e => setCurrentCategory({...currentCategory, imageUrl: e.target.value})} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex justify-end space-x-2">
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
              <th className="px-6 py-3 font-medium w-24">Image</th>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><img src={cat.imageUrl} alt="" className="w-12 h-12 object-cover rounded" /></td>
                <td className="px-6 py-4">{cat.name}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => { setCurrentCategory(cat); setIsEditing(true); }} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
