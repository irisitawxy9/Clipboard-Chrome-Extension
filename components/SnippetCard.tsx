
import React, { useState } from 'https://esm.sh/react@19.0.0';
import { Snippet, JobCategory } from '../types';
import { ICONS } from '../constants';

interface SnippetCardProps {
  snippet: Snippet;
  category?: JobCategory;
  onDelete: (id: string) => void;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet, category, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col h-fit group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold uppercase tracking-wider">
            {snippet.type}
          </span>
          {category && (
            <span className={`px-2 py-1 ${category.color} text-white rounded-md text-xs font-semibold uppercase tracking-wider`}>
              {category.name}
            </span>
          )}
        </div>
        <button 
          onClick={() => onDelete(snippet.id)}
          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ICONS.Delete />
        </button>
      </div>

      <p className="text-slate-700 text-sm leading-relaxed mb-4 line-clamp-6 whitespace-pre-wrap">
        {snippet.content}
      </p>

      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">
          Created {new Date(snippet.createdAt).toLocaleDateString()}
        </span>
        <button 
          onClick={handleCopy}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            copied 
              ? 'bg-green-50 text-green-600' 
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
        >
          {copied ? <ICONS.Check /> : <ICONS.Copy />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};

export default SnippetCard;
