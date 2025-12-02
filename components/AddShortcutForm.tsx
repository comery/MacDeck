import React, { useState } from 'react';
import { IconPicker } from './IconPicker';
import { Shortcut } from '../types';
import { suggestCommand } from '../services/geminiService';
import { Sparkles, Loader2 } from 'lucide-react';

interface AddShortcutFormProps {
  onSave: (shortcut: Omit<Shortcut, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: Shortcut;
}

export const AddShortcutForm: React.FC<AddShortcutFormProps> = ({ onSave, onCancel, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [path, setPath] = useState(initialData?.path || '');
  const [command, setCommand] = useState(initialData?.command || 'npm run dev');
  const [port, setPort] = useState(initialData?.port || '3000');
  const [icon, setIcon] = useState<string>(initialData?.icon || 'terminal');
  const [isThinking, setIsThinking] = useState(false);

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Port (Optional)</label>
          <input
            type="text"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            placeholder="3000"
            className="w-full px-3 py-2 rounded-lg glass-input text-gray-800 placeholder-gray-500/70 font-mono text-sm"
          />
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
          className="px-4 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all text-sm font-medium"
        >
          {initialData ? 'Save Changes' : 'Create Shortcut'}
        </button>
      </div>
    </form>
  );
};