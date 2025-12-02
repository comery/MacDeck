import React, { useState, useEffect } from 'react';
import { Plus, Command, LayoutGrid, List as ListIcon, Search } from 'lucide-react';
import { Shortcut } from './types';
import { ShortcutCard } from './components/ShortcutCard';
import { Modal } from './components/Modal';
import { AddShortcutForm } from './components/AddShortcutForm';

function App() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('macdeck-shortcuts');
    if (saved) {
      try {
        setShortcuts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse shortcuts", e);
      }
    } else {
      // Add a demo shortcut
      const demo: Shortcut = {
        id: 'demo-1',
        name: 'My Awesome Project',
        path: '/Users/developer/awesome-project',
        command: 'npm run dev',
        icon: 'code',
        port: '3000',
        category: 'development',
        createdAt: Date.now()
      };
      setShortcuts([demo]);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('macdeck-shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  const handleSaveShortcut = (data: Omit<Shortcut, 'id' | 'createdAt'>) => {
    if (editingShortcut) {
      // Update existing
      setShortcuts(shortcuts.map(s => 
        s.id === editingShortcut.id 
          ? { ...s, ...data } 
          : s
      ));
    } else {
      // Create new
      const newShortcut: Shortcut = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: Date.now()
      };
      setShortcuts([...shortcuts, newShortcut]);
    }
    closeModal();
  };

  const handleEdit = (shortcut: Shortcut) => {
    setEditingShortcut(shortcut);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this shortcut?')) {
      setShortcuts(shortcuts.filter(s => s.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Add a small delay to clear editing state so the modal animation doesn't glitch with content change
    setTimeout(() => setEditingShortcut(undefined), 300);
  };

  /**
   * Generates a .command file (Mac executable script) and triggers download.
   * This is the bridge between the web app and the local OS.
   */
  const handleDownload = (shortcut: Shortcut) => {
    const scriptContent = `#!/bin/bash
# MacDeck Launcher for ${shortcut.name}

echo "🚀 Launching ${shortcut.name}..."

# 1. Open Browser (optional, if port is known)
${shortcut.port ? `open "http://localhost:${shortcut.port}"` : ''}

# 2. Navigate to directory
cd "${shortcut.path}" || { echo "❌ Directory not found: ${shortcut.path}"; exit 1; }

# 3. Execute Command
echo "📂 Working Directory: $(pwd)"
echo "⚡ Running: ${shortcut.command}"
${shortcut.command}
`;

    const blob = new Blob([scriptContent], { type: 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${shortcut.name.replace(/\s+/g, '-')}.command`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show instruction toast (simulated via alert for now, could be a toast component)
    alert(`Downloaded "${a.download}"!\n\nYou may need to grant execute permission once:\nchmod +x ${a.download}`);
  };

  /**
   * Simulates running (or just triggers the download logic which is the "run" action in this context)
   */
  const handleRun = (shortcut: Shortcut) => {
      // In a real Electron app, this would use IPC to spawn a process.
      // In a web app, we guide the user to the "Launcher" file.
      handleDownload(shortcut);
  };

  const filteredShortcuts = shortcuts.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-screen flex flex-col text-gray-800 font-sans selection:bg-blue-500/30">
      
      {/* Top Bar / Header */}
      <header className="glass-panel mx-4 mt-4 rounded-2xl px-6 py-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-gray-800 to-black text-white p-2 rounded-lg shadow-lg">
            <Command size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">MacDeck</h1>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden sm:block">
           <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search shortcuts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-sm transition-all focus:ring-2 focus:ring-blue-500/20"
            />
           </div>
        </div>

        <div className="flex items-center gap-2">
           <div className="glass-input p-1 rounded-lg flex gap-1 mr-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/30 text-gray-500'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                 onClick={() => setViewMode('list')}
                 className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/30 text-gray-500'}`}
              >
                <ListIcon size={16} />
              </button>
           </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-blue-500/30 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Add Shortcut</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </header>
      
      {/* Mobile Search Bar (visible only on small screens) */}
      <div className="px-4 mt-4 sm:hidden">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search shortcuts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-sm"
            />
           </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
        {filteredShortcuts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center pb-20">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/20">
              <Command size={48} className="text-white/50" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No shortcuts found</h2>
            <p className="text-gray-600 max-w-sm">Create a new shortcut to get started, or adjust your search.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-6 text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Create your first shortcut
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "flex flex-col gap-3"
          }>
            {filteredShortcuts.map(shortcut => (
              <div key={shortcut.id} className={viewMode === 'list' ? '' : 'h-48'}>
                <ShortcutCard 
                  shortcut={shortcut} 
                  onRun={handleRun} 
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  viewMode={viewMode}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 glass-panel mx-4 mb-2 rounded-lg flex items-center px-4 justify-between text-[10px] text-gray-500 uppercase tracking-wider font-semibold shrink-0">
        <span>MacDeck v1.0</span>
        <span>{shortcuts.length} Shortcuts</span>
      </footer>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={editingShortcut ? "Edit Shortcut" : "New Application Shortcut"}
      >
        <AddShortcutForm 
          key={editingShortcut ? editingShortcut.id : 'new'}
          initialData={editingShortcut}
          onSave={handleSaveShortcut} 
          onCancel={closeModal} 
        />
      </Modal>
    </div>
  );
}

export default App;