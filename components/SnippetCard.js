
import React, { useState } from 'https://esm.sh/react@19.0.0';
import { ICONS } from '../constants.js';

const h = React.createElement;

export default function SnippetCard({ snippet, category, onDelete }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return h('div', { className: "bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col h-fit group" },
    h('div', { className: "flex items-start justify-between mb-3" },
      h('div', { className: "flex flex-wrap gap-2" },
        h('span', { className: "px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold uppercase tracking-wider" }, snippet.type),
        category && h('span', { className: `px-2 py-1 ${category.color} text-white rounded-md text-xs font-semibold uppercase tracking-wider` }, category.name)
      ),
      h('button', {
        onClick: () => onDelete(snippet.id),
        className: "text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      }, h(ICONS.Delete))
    ),
    h('p', { className: "text-slate-700 text-sm leading-relaxed mb-4 line-clamp-6 whitespace-pre-wrap" }, snippet.content),
    h('div', { className: "mt-auto pt-4 border-t border-slate-50 flex items-center justify-between" },
      h('span', { className: "text-[10px] text-slate-400" }, new Date(snippet.createdAt).toLocaleDateString()),
      h('button', {
        onClick: handleCopy,
        className: `flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${copied ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`
      },
        h('span', null, copied ? 'Copied' : 'Copy')
      )
    )
  );
}
