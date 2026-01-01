
import React from 'https://esm.sh/react@19.0.0';
import { Snippet, JobCategory } from '../types';
import SnippetCard from './SnippetCard';

interface SnippetListProps {
  snippets: Snippet[];
  onDelete: (id: string) => void;
  categories: JobCategory[];
}

const SnippetList: React.FC<SnippetListProps> = ({ snippets, onDelete, categories }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {snippets.map(snippet => (
        <SnippetCard 
          key={snippet.id} 
          snippet={snippet} 
          onDelete={onDelete}
          category={categories.find(c => c.id === snippet.categoryId)}
        />
      ))}
    </div>
  );
};

export default SnippetList;
