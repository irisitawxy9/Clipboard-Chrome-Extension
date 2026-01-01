
import React, { useState } from 'https://esm.sh/react@19.0.0';
import { SNIPPET_TYPES } from '../constants.js';

const h = React.createElement;

export default function AddSnippetModal({ categories, activeCategoryId, onClose, onAdd }) {
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState(activeCategoryId === 'all' ? (categories[0]?.id || '') : activeCategoryId);
  const [type, setType] = useState('Experience');

  return h('div', { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" },
    h('div', { className: "bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" },
      h('div', { className: "p-6 border-b border-slate-100 flex justify-between items-center" },
        h('h2', { className: "text-xl font-bold text-slate-800" }, "Add Snippet"),
        h('button', { onClick: onClose, className: "text-slate-400 hover:text-slate-600 text-2xl" }, "×")
      ),
      h('div', { className: "p-6 space-y-4" },
        h('textarea', {
          autoFocus: true,
          className: "w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm",
          placeholder: "Paste content here...",
          value: content,
          onChange: (e) => setContent(e.target.value)
        }),
        h('div', { className: "grid grid-cols-2 gap-4" },
          h('select', {
            className: "p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm",
            value: categoryId,
            onChange: (e) => setCategoryId(e.target.value)
          },
            categories.map(c => h('option', { key: c.id, value: c.id }, c.name))
          ),
          h('select', {
            className: "p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm",
            value: type,
            onChange: (e) => setType(e.target.value)
          },
            SNIPPET_TYPES.map(t => h('option', { key: t, value: t }, t))
          )
        )
      ),
      h('div', { className: "p-6 bg-slate-50 flex justify-end space-x-3" },
        h('button', { onClick: onClose, className: "px-6 py-2.5 text-slate-600 font-medium transition-colors" }, "Cancel"),
        h('button', {
          disabled: !content.trim(),
          onClick: () => onAdd(content, categoryId, type),
          className: "px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all shadow-sm"
        }, "Save")
      )
    )
  );
}
