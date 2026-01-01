
import React from 'https://esm.sh/react@19.0.0';
import { JobCategory } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  categories: JobCategory[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  onOpenCategoryModal: () => void;
  onEditCategory: (cat: JobCategory) => void;
  onDeleteCategory: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  categories, 
  activeCategoryId, 
  onSelectCategory, 
  onOpenCategoryModal,
  onEditCategory,
  onDeleteCategory
}) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">JobFlow</h1>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        <div className="px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
          Filters
        </div>
        
        <button 
          className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 text-left ${
            activeCategoryId === 'all' 
              ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          onClick={() => onSelectCategory('all')}
        >
          <div className={`w-2 h-2 rounded-full ${activeCategoryId === 'all' ? 'bg-blue-600' : 'bg-slate-400'}`} />
          <span className="text-sm">All Jobs</span>
        </button>

        <div className="h-4" />
        
        <div className="px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
          Job Types
        </div>

        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className={`group relative flex items-center p-0.5 rounded-xl transition-all duration-200 ${
              activeCategoryId === cat.id 
                ? 'bg-blue-50' 
                : 'hover:bg-slate-50'
            }`}
          >
            <button 
              className={`flex-1 flex items-center space-x-3 p-2.5 text-left truncate rounded-lg ${
                activeCategoryId === cat.id ? 'text-blue-700 font-bold' : 'text-slate-600 font-medium'
              }`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cat.color || 'bg-slate-300'}`} />
              <span className="truncate text-sm">{cat.name}</span>
            </button>
            
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity pr-1">
              <button 
                type="button"
                className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                title="Rename Category"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditCategory(cat);
                }}
              >
                <ICONS.Edit />
              </button>

              <button 
                type="button"
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Delete Category"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Permanently delete "${cat.name}"? All associated snippets will also be removed.`)) {
                    onDeleteCategory(cat.id);
                  }
                }}
              >
                <ICONS.Delete />
              </button>
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={onOpenCategoryModal}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-semibold text-sm"
        >
          <ICONS.Add />
          <span>New Job Type</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
