
import React, { useState, useEffect } from 'https://esm.sh/react@19.0.0';

const h = React.createElement;

export default function CategoryModal({ onClose, onSave, category }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    }
  }, [category]);

  return h('div', { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" },
    h('div', { className: "bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200" },
      h('div', { className: "p-6 border-b border-slate-100 flex justify-between items-center" },
        h('h2', { className: "text-xl font-bold text-slate-800" }, category ? 'Edit Job Type' : 'New Job Type'),
        h('button', { onClick: onClose, className: "text-slate-400 text-2xl" }, "×")
      ),
      h('div', { className: "p-6 space-y-4" },
        h('input', {
          type: "text",
          placeholder: "Title",
          className: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500",
          value: name,
          onChange: (e) => setName(e.target.value)
        }),
        h('input', {
          type: "text",
          placeholder: "Description",
          className: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500",
          value: description,
          onChange: (e) => setDescription(e.target.value)
        })
      ),
      h('div', { className: "p-6 bg-slate-50 flex justify-end space-x-3 rounded-b-3xl" },
        h('button', { onClick: onClose, className: "px-6 py-2 text-slate-600" }, "Cancel"),
        h('button', {
          onClick: () => name.trim() && onSave(name, description, category?.id),
          className: "px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-sm"
        }, "Save")
      )
    )
  );
}
