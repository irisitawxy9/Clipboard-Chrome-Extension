import { DEFAULT_TYPES, DEFAULT_CATEGORIES, ICONS, TYPE_ICONS, AVAILABLE_ICON_KEYS } from './constants.js';

const STORAGE_KEY = 'clipboard_v4';

const storage = {
  get: async (key) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const result = await chrome.storage.local.get(key);
      return result[key];
    }
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  set: async (key, value) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return await chrome.storage.local.set({ [key]: value });
    }
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export class App {
  constructor(root) {
    this.root = root;
    this.state = {
      snippets: [],
      categories: DEFAULT_CATEGORIES,
      types: DEFAULT_TYPES,
      activeCategoryId: 'all',
      searchQuery: '',
      isAddModalOpen: false,
      editingSnippetId: null,
      isCategoryModalOpen: false,
      editingCategoryId: null,
      isTypeModalOpen: false,
      editingTypeId: null,
      selectedIconKey: 'Other' // Temporary state for type icon selection
    };
  }

  async init() {
    const saved = await storage.get(STORAGE_KEY);
    if (saved) {
      this.state.snippets = saved.snippets || [];
      this.state.categories = saved.categories || DEFAULT_CATEGORIES;
      this.state.types = saved.types || DEFAULT_TYPES;
    }
    this.render();
  }

  setState(update) {
    this.state = { ...this.state, ...update };
    this.render();
    storage.set(STORAGE_KEY, {
      snippets: this.state.snippets,
      categories: this.state.categories,
      types: this.state.types
    });
  }

  render() {
    const { snippets, categories, types, activeCategoryId, searchQuery, isAddModalOpen, editingSnippetId, isCategoryModalOpen, editingCategoryId, isTypeModalOpen, editingTypeId, selectedIconKey } = this.state;

    const filtered = snippets.filter(s => {
      const matchesCategory = activeCategoryId === 'all' || s.categoryId === activeCategoryId;
      const matchesSearch = s.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => b.createdAt - a.createdAt);

    const editingSnippet = snippets.find(s => s.id === editingSnippetId);
    const editingCategory = categories.find(c => c.id === editingCategoryId);
    const editingType = types.find(t => t.id === editingTypeId);

    this.root.innerHTML = `
      <div class="app-container">
        <!-- Sidebar -->
        <aside class="sidebar">
          <div class="logo">
            <div class="logo-icon">C</div>
            <h1>Clipboard</h1>
          </div>
          <nav class="nav">
            <div class="nav-label">Filters</div>
            <button class="nav-item ${activeCategoryId === 'all' ? 'active' : ''}" id="btn-all">
              <span class="dot" style="background: #cbd5e1"></span>
              All Library
            </button>
            
            <div class="nav-label">Categories</div>
            ${categories.map(cat => `
              <div class="nav-item-wrapper ${activeCategoryId === cat.id ? 'active' : ''}">
                <button class="nav-item cat-btn" data-id="${cat.id}">
                  <span class="dot" style="background: ${cat.color}"></span>
                  <span class="truncate">${cat.name}</span>
                </button>
                <div class="nav-item-actions">
                  <button class="cat-edit-btn" data-id="${cat.id}">${ICONS.Edit}</button>
                  <button class="cat-delete-btn" data-id="${cat.id}">${ICONS.Delete}</button>
                </div>
              </div>
            `).join('')}
            <button class="btn-add-mini" id="new-cat-btn">${ICONS.Add} Add Category</button>

            <div class="nav-label" style="margin-top: 24px">Snippet Types</div>
            ${types.map(t => `
              <div class="nav-item-wrapper">
                <div class="nav-item no-click">
                  <div class="mini-type-icon" style="background: ${t.color}20; color: ${t.color}">${TYPE_ICONS[t.icon] || TYPE_ICONS.Hash}</div>
                  <span class="truncate">${t.name}</span>
                </div>
                <div class="nav-item-actions">
                  <button class="type-edit-btn" data-id="${t.id}">${ICONS.Edit}</button>
                  <button class="type-delete-btn" data-id="${t.id}">${ICONS.Delete}</button>
                </div>
              </div>
            `).join('')}
            <button class="btn-add-mini" id="new-type-btn">${ICONS.Add} Add Type</button>
          </nav>
          
          <div class="sidebar-footer">
             <div class="footer-credit">
                Designed and created by <a href="https://iriswxy.com" target="_blank">Iris (iriswxy.com)</a>
             </div>
          </div>
        </aside>

        <!-- Main Workspace -->
        <main class="main">
          <header class="header">
            <div class="search-container">
              <span class="search-icon">${ICONS.Search}</span>
              <input type="text" id="search-input" placeholder="Search snippets..." value="${searchQuery}">
            </div>
            <div class="actions">
              <button class="btn btn-icon" id="export-btn" title="Export Data">${ICONS.Export}</button>
              <button class="btn btn-icon" id="import-trigger" title="Import Data">${ICONS.Import}</button>
              <input type="file" id="import-input" style="display:none" accept=".json">
              <div class="divider"></div>
              <button class="btn btn-primary" id="add-btn">${ICONS.Add} New Snippet</button>
            </div>
          </header>

          <div class="content-grid">
            ${filtered.length > 0 ? filtered.map(s => {
              const cat = categories.find(c => c.id === s.categoryId);
              const type = types.find(t => t.id === s.typeId);
              const iconSvg = TYPE_ICONS[type?.icon] || TYPE_ICONS.Hash;
              return `
                <div class="card">
                  <div class="card-header">
                    <div class="card-badges">
                      <span class="type-badge" title="${type?.name || 'Other'}" style="background: ${type?.color || '#64748b'}20; color: ${type?.color || '#64748b'}">
                        ${iconSvg}
                      </span>
                      <span class="badge" style="background: ${cat ? cat.color : '#64748b'}">${cat ? cat.name : 'Misc'}</span>
                    </div>
                    <div class="card-actions">
                      <button class="edit-snippet-btn" data-id="${s.id}">${ICONS.Edit}</button>
                      <button class="delete-btn" data-id="${s.id}">${ICONS.Delete}</button>
                    </div>
                  </div>
                  <p class="card-content">${s.content}</p>
                  <div class="card-footer">
                    <span class="date">${new Date(s.createdAt).toLocaleDateString()}</span>
                    <button class="copy-btn" data-content="${s.content.replace(/"/g, '&quot;')}">${ICONS.Copy} Copy</button>
                  </div>
                </div>
              `;
            }).join('') : `
              <div class="empty-state">
                <p>No results found. Add a snippet or change filters.</p>
              </div>
            `}
          </div>
        </main>

        <!-- Snippet Modal -->
        <div class="modal-overlay ${isAddModalOpen ? 'active' : ''}">
          <div class="modal">
            <div class="modal-header">
              <h2>${editingSnippetId ? 'Edit Snippet' : 'New Snippet'}</h2>
              <button id="modal-close" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <textarea id="modal-text" placeholder="Type or paste your content here...">${editingSnippet ? editingSnippet.content : ''}</textarea>
              <div class="form-row">
                <div class="form-group">
                  <label>Category</label>
                  <select id="modal-cat">
                    <option value="" ${editingSnippet && !editingSnippet.categoryId ? 'selected' : ''}>None (Misc)</option>
                    ${categories.map(c => `<option value="${c.id}" ${editingSnippet && editingSnippet.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label>Snippet Type</label>
                  <select id="modal-type">
                    ${types.map(t => `<option value="${t.id}" ${editingSnippet && editingSnippet.typeId === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" id="modal-cancel">Cancel</button>
              <button class="btn btn-primary" id="modal-save">Save Snippet</button>
            </div>
          </div>
        </div>

        <!-- Structure Modal (Categories / Types) -->
        <div class="modal-overlay ${isCategoryModalOpen || isTypeModalOpen ? 'active' : ''}">
          <div class="modal small">
            <div class="modal-header">
              <h2>${isCategoryModalOpen ? (editingCategoryId ? 'Edit Category' : 'New Category') : (editingTypeId ? 'Edit Type' : 'New Type')}</h2>
              <button id="structure-modal-close" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Name</label>
                <input type="text" id="structure-name-input" placeholder="e.g. Frontend" value="${isCategoryModalOpen ? (editingCategory?.name || '') : (editingType?.name || '')}">
              </div>
              <div class="form-group">
                <label>Color Theme</label>
                <input type="color" id="structure-color-input" value="${isCategoryModalOpen ? (editingCategory?.color || '#2563eb') : (editingType?.color || '#2563eb')}">
              </div>
              ${isTypeModalOpen ? `
                <div class="form-group">
                  <label>Icon Choice</label>
                  <div class="icon-picker-grid">
                    ${AVAILABLE_ICON_KEYS.map(key => `
                      <button class="icon-picker-item ${selectedIconKey === key ? 'active' : ''}" data-icon="${key}" style="${selectedIconKey === key ? `border-color: ${editingType?.color || '#2563eb'}; background: ${editingType?.color || '#2563eb'}10;` : ''}">
                        ${TYPE_ICONS[key]}
                      </button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" id="structure-modal-cancel">Cancel</button>
              <button class="btn btn-primary" id="structure-modal-save">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    // Basic Navigation
    document.getElementById('btn-all')?.addEventListener('click', () => this.setState({ activeCategoryId: 'all' }));
    document.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setState({ activeCategoryId: btn.dataset.id }));
    });

    // Search
    const searchInput = document.getElementById('search-input');
    searchInput?.addEventListener('input', (e) => this.state.searchQuery = e.target.value);

    // Modal Generic Closures
    const closeSnippet = () => this.setState({ isAddModalOpen: false, editingSnippetId: null });
    const closeStructure = () => this.setState({ isCategoryModalOpen: false, isTypeModalOpen: false, editingCategoryId: null, editingTypeId: null });

    document.getElementById('modal-close')?.addEventListener('click', closeSnippet);
    document.getElementById('modal-cancel')?.addEventListener('click', closeSnippet);
    document.getElementById('structure-modal-close')?.addEventListener('click', closeStructure);
    document.getElementById('structure-modal-cancel')?.addEventListener('click', closeStructure);

    // Opening Modals
    document.getElementById('add-btn')?.addEventListener('click', () => this.setState({ isAddModalOpen: true, editingSnippetId: null }));
    document.getElementById('new-cat-btn')?.addEventListener('click', () => this.setState({ isCategoryModalOpen: true, editingCategoryId: null }));
    document.getElementById('new-type-btn')?.addEventListener('click', () => this.setState({ isTypeModalOpen: true, editingTypeId: null, selectedIconKey: 'Hash' }));

    // Saving Snippets
    document.getElementById('modal-save')?.addEventListener('click', () => {
      const content = document.getElementById('modal-text').value.trim();
      const categoryId = document.getElementById('modal-cat').value;
      const typeId = document.getElementById('modal-type').value;
      if (!content) return;
      let snippets = [...this.state.snippets];
      if (this.state.editingSnippetId) {
        snippets = snippets.map(s => s.id === this.state.editingSnippetId ? { ...s, content, categoryId, typeId } : s);
      } else {
        snippets.push({ id: Math.random().toString(36).substr(2, 9), content, categoryId, typeId, createdAt: Date.now() });
      }
      this.setState({ snippets, isAddModalOpen: false, editingSnippetId: null });
    });

    // Saving Categories / Types
    document.getElementById('structure-modal-save')?.addEventListener('click', () => {
      const name = document.getElementById('structure-name-input').value.trim();
      const color = document.getElementById('structure-color-input').value;
      const icon = this.state.selectedIconKey || 'Hash';
      if (!name) return;

      if (this.state.isCategoryModalOpen) {
        let categories = [...this.state.categories];
        if (this.state.editingCategoryId) {
          categories = categories.map(c => c.id === this.state.editingCategoryId ? { ...c, name, color } : c);
        } else {
          categories.push({ id: Math.random().toString(36).substr(2, 9), name, color });
        }
        this.setState({ categories, isCategoryModalOpen: false, editingCategoryId: null });
      } else {
        let types = [...this.state.types];
        if (this.state.editingTypeId) {
          types = types.map(t => t.id === this.state.editingTypeId ? { ...t, name, color, icon } : t);
        } else {
          types.push({ id: Math.random().toString(36).substr(2, 9), name, color, icon });
        }
        this.setState({ types, isTypeModalOpen: false, editingTypeId: null });
      }
    });

    // Icon Selection logic
    document.querySelectorAll('.icon-picker-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.selectedIconKey = btn.dataset.icon;
        this.render(); // Re-render to show selection (keeping modal open)
      });
    });

    // Row Actions (Edit/Delete)
    document.querySelectorAll('.edit-snippet-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setState({ isAddModalOpen: true, editingSnippetId: btn.dataset.id }));
    });
    document.querySelectorAll('.cat-edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setState({ isCategoryModalOpen: true, editingCategoryId: btn.dataset.id });
      });
    });
    document.querySelectorAll('.type-edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = this.state.types.find(t => t.id === btn.dataset.id);
        this.setState({ isTypeModalOpen: true, editingTypeId: btn.dataset.id, selectedIconKey: type?.icon || 'Hash' });
      });
    });

    document.querySelectorAll('.cat-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Remove this category? Snippets won\'t be deleted.')) {
          this.setState({ 
            categories: this.state.categories.filter(c => c.id !== btn.dataset.id),
            snippets: this.state.snippets.map(s => s.categoryId === btn.dataset.id ? { ...s, categoryId: "" } : s)
          });
        }
      });
    });

    document.querySelectorAll('.type-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Remove this type? Snippets will revert to default.')) {
          this.setState({ 
            types: this.state.types.filter(t => t.id !== btn.dataset.id),
            snippets: this.state.snippets.map(s => s.typeId === btn.dataset.id ? { ...s, typeId: this.state.types[0]?.id || "" } : s)
          });
        }
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this snippet?')) {
          this.setState({ snippets: this.state.snippets.filter(s => s.id !== btn.dataset.id) });
        }
      });
    });

    // Copying with Feedback
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.content).then(() => {
          const original = btn.innerHTML;
          btn.innerHTML = 'Copied!';
          btn.classList.add('copy-success');
          setTimeout(() => {
            btn.innerHTML = original;
            btn.classList.remove('copy-success');
          }, 1500);
        });
      });
    });

    // Import / Export
    document.getElementById('export-btn')?.addEventListener('click', () => {
      const data = JSON.stringify({ snippets: this.state.snippets, categories: this.state.categories, types: this.state.types }, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clipboard-backup.json`;
      link.click();
    });

    document.getElementById('import-trigger')?.addEventListener('click', () => document.getElementById('import-input').click());
    document.getElementById('import-input')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          this.setState({ snippets: data.snippets || [], categories: data.categories || DEFAULT_CATEGORIES, types: data.types || DEFAULT_TYPES });
        } catch (e) { alert('Invalid backup file.'); }
      };
      reader.readAsText(file);
    });
  }
}
