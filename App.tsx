
import React, { useState, useEffect, useMemo } from 'https://esm.sh/react@19.0.0';
import { Snippet, JobCategory, SnippetType } from './types';
import { DEFAULT_CATEGORIES, SNIPPET_TYPES, ICONS } from './constants';
import Sidebar from './components/Sidebar';
import SnippetList from './components/SnippetList';
import Header from './components/Header';
import AddSnippetModal from './components/AddSnippetModal';
import CategoryModal from './components/CategoryModal';

const STORAGE_KEY = 'jobflow_data_v1';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 9);
};

const App: React.FC = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>(DEFAULT_CATEGORIES);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<JobCategory | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.snippets && Array.isArray(parsed.snippets)) setSnippets(parsed.snippets);
        if (parsed.categories && Array.isArray(parsed.categories)) setCategories(parsed.categories);
      } catch (e) {
        console.error("Failed to load initial data", e);
      }
    }
  }, []);

  // Save to local storage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ snippets, categories }));
  }, [snippets, categories]);

  const filteredSnippets = useMemo(() => {
    return snippets.filter(s => {
      const matchesCategory = activeCategoryId === 'all' || s.categoryId === activeCategoryId;
      const matchesSearch = 
        s.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => b.createdAt - a.createdAt);
  }, [snippets, activeCategoryId, searchQuery]);

  const handleAddSnippet = (content: string, categoryId: string, type: SnippetType) => {
    const newSnippet: Snippet = {
      id: generateId(),
      content,
      categoryId,
      type,
      createdAt: Date.now(),
    };
    setSnippets(prev => [newSnippet, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleDeleteSnippet = (id: string) => {
    setSnippets(prev => prev.filter(s => s.id !== id));
  };

  const handleSaveCategory = (name: string, description: string, id?: string) => {
    if (id) {
      setCategories(prev => prev.map(c => c.id === id ? { ...c, name, description } : c));
    } else {
      const newCategory: JobCategory = {
        id: generateId(),
        name,
        description,
        color: `bg-${['blue', 'indigo', 'purple', 'emerald', 'amber'][Math.floor(Math.random() * 5)]}-500`,
      };
      setCategories(prev => [...prev, newCategory]);
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    setSnippets(prev => prev.filter(s => s.categoryId !== id));
    setCategories(prev => prev.filter(c => c.id !== id));
    if (activeCategoryId === id) {
      setActiveCategoryId('all');
    }
  };

  const importFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        const targetCategory = activeCategoryId === 'all' 
          ? (categories.length > 0 ? categories[0].id : 'all') 
          : activeCategoryId;
        handleAddSnippet(text.trim(), targetCategory, 'Other');
      } else {
        alert("Clipboard is empty.");
      }
    } catch (err) {
      alert("Clipboard access denied. Ensure you have granted the necessary permissions to the extension.");
    }
  };

  const exportData = () => {
    const data = JSON.stringify({ snippets, categories }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jobflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      let importedSnippets: Snippet[] = [];
      let importedCategories: JobCategory[] = [];

      if (data && typeof data === 'object' && !Array.isArray(data)) {
        importedSnippets = Array.isArray(data.snippets) ? data.snippets : [];
        importedCategories = Array.isArray(data.categories) ? data.categories : [];
      } else if (Array.isArray(data)) {
        importedSnippets = data.map((item: any) => ({
          id: item.id || generateId(),
          content: typeof item === 'string' ? item : (item.content || ''),
          type: item.type || 'Other',
          categoryId: item.categoryId || 'all',
          createdAt: item.createdAt || Date.now()
        }));
      }

      if (importedSnippets.length > 0 || importedCategories.length > 0) {
        if (confirm(`Import ${importedSnippets.length} snippets? Current data will be replaced.`)) {
          setSnippets([...importedSnippets]);
          if (importedCategories.length > 0) {
            setCategories([...importedCategories]);
          }
          setActiveCategoryId('all');
        }
      }
    } catch (e) {
      alert("Failed to parse the imported JSON file.");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar 
        categories={categories} 
        activeCategoryId={activeCategoryId} 
        onSelectCategory={setActiveCategoryId} 
        onOpenCategoryModal={() => {
          setEditingCategory(null);
          setIsCategoryModalOpen(true);
        }}
        onEditCategory={(cat) => {
          setEditingCategory(cat);
          setIsCategoryModalOpen(true);
        }}
        onDeleteCategory={handleDeleteCategory}
      />

      <div className="flex-1 flex flex-col h-full relative">
        <Header 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          onImportClipboard={importFromClipboard}
          onAddClick={() => setIsAddModalOpen(true)}
          onExportData={exportData}
          onImportData={importData}
        />
        
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {filteredSnippets.length > 0 ? (
            <SnippetList 
              snippets={filteredSnippets} 
              onDelete={handleDeleteSnippet}
              categories={categories}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <div className="bg-slate-100 p-6 rounded-full">
                <ICONS.Category />
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-slate-500">No snippets found</p>
                <p className="text-sm">Add a new snippet to your library or use the search above.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {isAddModalOpen && (
        <AddSnippetModal 
          categories={categories}
          activeCategoryId={activeCategoryId}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddSnippet}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryModal 
          onClose={() => {
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
          }}
          category={editingCategory || undefined}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
};

export default App;
