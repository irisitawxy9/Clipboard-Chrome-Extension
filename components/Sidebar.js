
import React from 'https://esm.sh/react@19.0.0';
import { ICONS } from '../constants.js';

const h = React.createElement;

export default function Sidebar({ categories, activeCategoryId, onSelectCategory, onOpenCategoryModal, onEditCategory, onDeleteCategory }) {
  return h('aside', { className: "w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm" },
    h('div', { className: "p-6 border-b border-slate-100 flex items-center space-x-2" },
      h('div', { className: "bg-blue-600 p-2 rounded-lg text-white" },
        h('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
          h('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" })
        )
      ),
      h('h1', { className: "text-xl font-bold text-slate-800" }, "JobFlow")
    ),
    h('nav', { className: "flex-1 overflow-y-auto p-4 space-y-1" },
      h('button', {
        onClick: () => onSelectCategory('all'),
        className: `w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeCategoryId === 'all' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`
      },
        h('div', { className: `w-2 h-2 rounded-full ${activeCategoryId === 'all' ? 'bg-blue-600' : 'bg-slate-400'}` }),
        h('span', { className: "text-sm" }, "All Jobs")
      ),
      h('div', { className: "h-4" }),
      categories.map(cat => (
        h('button', {
          key: cat.id,
          onClick: () => onSelectCategory(cat.id),
          className: `w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeCategoryId === cat.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`
        },
          h('div', { className: `w-2 h-2 rounded-full ${cat.color || 'bg-slate-400'}` }),
          h('span', { className: "text-sm truncate" }, cat.name)
        )
      ))
    ),
    h('div', { className: "p-4 border-t border-slate-100" },
      h('button', {
        onClick: onOpenCategoryModal,
        className: "w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors"
      },
        h(ICONS.Add),
        h('span', null, "New Job Type")
      )
    )
  );
}
