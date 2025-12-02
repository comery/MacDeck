import React, { useState, useEffect } from 'react';
import { IconPicker } from './IconPicker';
import { Shortcut } from '../types';
import { suggestCommand } from '../services/geminiService';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface AddShortcutFormProps {
  onSave: (shortcut: Omit<Shortcut, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: Shortcut;
  existingShortcuts: Shortcut[];
}

const findNextAvailablePort = (existing: Shortcut[], currentId?: string): string => {
  const usedPorts = new Set(
    existing
      .filter(s => s.id !== currentId && s.port)
      .map(s => parseInt(s.port || '0', 10))
  );

  let port = 3000;
  // find first gap or end
  while (usedPorts.has(port)) {
    port++;
  }
  return port.toString();
};

export const AddShortcutForm: React.FC<AddShortcutFormProps> = ({ onSave, onCancel, initialData, existingShortcuts }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [path, setPath] = useState(initialData?.path || '');
  const [command, setCommand] = useState(initialData?.command || 'npm run dev');
  
  // Auto-assign port if new, otherwise use existing
  const [port, setPort] = useState(() => {
    if (initialData?.port) return initialData.port;
    return findNextAvailablePort(existingShortcuts);
  });
  
  const [icon, setIcon] = useState<string>(initialData?.icon || 'terminal');
  const [isThinking, setIsThinking] = useState(false);
  const [portError, setPortError] = useState<string | null>(null);

  // Check for port collisions when port changes
  useEffect(() => {
    if (!port) {
      setPortError(null);
      return;
    }
    
    const isTaken = existingShortcuts.some(s => 
      s.id !== initialData?.id && // Don't match self
      s.port === port
    );

    if (isTaken) {
      setPortError(`Port ${port} is already used by another shortcut.`);
    } else {
      setPortError(null);
    }
  }, [port, existingShortcuts, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      path,
      command,
      port,
      icon,
      category: 'development'
    });
  };

  const handleSmartSuggest = async () => {
    if (!name && !path) return;
    setIsThinking(true);
    const context = `Project name: ${name}. Path: ${path}.`;
    const suggested = await suggestCommand(context);
    setCommand(suggested);
    setIsThinking(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
        <input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. My Dashboard"
          className="w-full px-3 py-2 rounded-lg glass-input text-gray-800 placeholder-gray-500/70"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Local Path</label>
        <input
          required
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="/Users/me/projects/cool-app"
          className="w-full px-3 py-2 rounded-lg glass-input text-gray-800 placeholder-gray-500/70 font-mono text-sm"
        />
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between items-center">
          <span>Run Command</span>
          <button
            type="button"
            onClick={handleSmartSuggest}
            disabled={isThinking || (!name && !path)}
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            {isThinking ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            AI Suggest
          </button>
        </label>
        <input
          required
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="npm run dev"
          className="w-full px-3 py-2 rounded-lg glass-input text-gray-800 placeholder-gray-500/70 font-mono text-sm"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
          <div className="relative">
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="3000"
              className={`w-full px-3 py-2 rounded-lg glass-input placeholder-gray-500/70 font-mono text-sm ${portError ? 'border-red-400 focus:border-red-500 bg-red-50/30' : ''}`}
            />
            {portError && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" title={portError}>
                <AlertCircle size={16} />
              </div>
            )}
          </div>
          {portError ? (
             <p className="text-xs text-red-500 mt-1">{portError}</p>
          ) : (
             <p className="text-[10px] text-gray-500 mt-1">
               {initialData ? 'Port used by this app.' : 'Auto-assigned to avoid conflicts.'}
             </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
        <IconPicker selected={icon} onSelect={setIcon} />
      </div>

      <div className="pt-4 flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-gray-700 hover:bg-black/5 transition-colors text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!!portError}
          className="px-4 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all text-sm font-medium disabled:opacity-50 disabled:shadow-none"
        >
          {initialData ? 'Save Changes' : 'Create Shortcut'}
        </button>
      </div>
    </form>
  );
};