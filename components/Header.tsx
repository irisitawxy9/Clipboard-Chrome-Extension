
import React, { useRef } from 'https://esm.sh/react@19.0.0';
import { ICONS } from '../constants';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onImportClipboard: () => void;
  onAddClick: () => void;
  onExportData: () => void;
  onImportData: (data: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  searchQuery, 
  onSearchChange, 
  onImportClipboard, 
  onAddClick,
  onExportData,
  onImportData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          onImportData(result);
        }
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between space-x-4">
      <div className="relative flex-1 max-w-lg">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <ICONS.Search />
        </div>
        <input 
          type="text"
          placeholder="Search snippets, skills, or types..."
          className="block w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-3">
        <input 
          type="file" 
          accept=".json" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          title="Import Data (JSON)"
          className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ICONS.Import />
        </button>
        <button 
          onClick={onExportData}
          title="Export Data (JSON)"
          className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ICONS.Export />
        </button>
        <div className="w-px h-6 bg-slate-200 mx-1" />
        <button 
          onClick={onImportClipboard}
          title="Import from clipboard"
          className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ICONS.Copy />
        </button>
        <button 
          onClick={onAddClick}
          className="flex items-center space-x-2 py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm hover:shadow-md font-medium"
        >
          <ICONS.Add />
          <span>Add Snippet</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
