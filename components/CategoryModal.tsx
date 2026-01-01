
import React, { useState, useEffect } from 'https://esm.sh/react@19.0.0';
import { JobCategory } from '../types';

interface CategoryModalProps {
  onClose: () => void;
  onSave: (name: string, description: string, id?: string) => void;
  category?: JobCategory;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ onClose, onSave, category }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), description.trim(), category?.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {category ? 'Rename Job Type' : 'New Job Type'}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl font-light">&times;</button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
            <input 
              autoFocus
              type="text"
              required
              placeholder="e.g., Fullstack Developer, Product Manager..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Optional)</label>
            <input 
              type="text"
              placeholder="A brief note about this category..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex justify-end space-x-3">
          <button 
            type="button"
            onClick={onClose} 
            className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={!name.trim()}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all shadow-sm active:scale-95"
          >
            {category ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryModal;
