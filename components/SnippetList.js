
import React from 'https://esm.sh/react@19.0.0';
import SnippetCard from './SnippetCard.js';

const h = React.createElement;

export default function SnippetList({ snippets, onDelete, categories }) {
  return h('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
    snippets.map(snippet => h(SnippetCard, {
      key: snippet.id,
      snippet: snippet,
      onDelete: onDelete,
      category: categories.find(c => c.id === snippet.categoryId)
    }))
  );
}
