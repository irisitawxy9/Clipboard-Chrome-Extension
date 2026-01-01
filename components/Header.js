
import React from 'https://esm.sh/react@19.0.0';
import { ICONS } from '../constants.js';

const h = React.createElement;

export default function Header({ searchQuery, onSearchChange, onImportClipboard, onAddClick }) {
  return h('header', { className: "sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between space-x-4" },
    h('div', { className: "relative flex-1 max-w-lg" },
      h('div', { className: "absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400" },
        h(ICONS.Search)
      ),
      h('input', {
        type: "text",
        placeholder: "Search snippets...",
        className: "block w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all",
        value: searchQuery,
        onChange: (e) => onSearchChange(e.target.value)
      })
    ),
    h('div', { className: "flex items-center space-x-3" },
      h('button', {
        onClick: onImportClipboard,
        title: "Import from clipboard",
        className: "p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
      },
        h('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
          h('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" })
        )
      ),
      h('button', {
        onClick: onAddClick,
        className: "flex items-center space-x-2 py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm font-medium"
      },
        h(ICONS.Add),
        h('span', null, "Add Snippet")
      )
    )
  );
}
