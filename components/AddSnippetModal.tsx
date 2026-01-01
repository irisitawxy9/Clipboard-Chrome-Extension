
import React, { useState } from 'https://esm.sh/react@19.0.0';
import { JobCategory, SnippetType } from '../types';
import { SNIPPET_TYPES } from '../constants';

interface AddSnippetModalProps {
  categories: JobCategory[];
  activeCategoryId: string;
  onClose: () => void;
  onAdd: (content: string, categoryId: string, type: SnippetType) => void;
}

const AddSnippetModal: React.FC<AddSnippetModalProps> = ({ categories, activeCategoryId, onClose, onAdd }) => {
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState(activeCategoryId === 'all' ? (categories[0]?.id || '') : activeCategoryId);
  const [type, setType] = useState<SnippetType>('Experience');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Add New Snippet</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">&times;</button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Snippet Content</label>
            <textarea 
              autoFocus
              className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed"
              placeholder="Paste your work experience, skill summary, or education details here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Job Type</label>
              <select 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Information Type</label>
              <select 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={type}
                onChange={(e) => setType(e.target.value as SnippetType)}
              >
                {SNIPPET_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-slate-600 font-medium hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={!content.trim()}
            onClick={() => onAdd(content, categoryId, type)}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all shadow-sm"
          >
            Save Snippet
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSnippetModal;
