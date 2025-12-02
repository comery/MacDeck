import React from 'react';
import { Play, Trash2, Pencil } from 'lucide-react';
import { Shortcut } from '../types';
import { getIconComponent } from './IconPicker';

interface ShortcutCardProps {
  shortcut: Shortcut;
  onRun: (shortcut: Shortcut) => void;
  onDelete: (id: string) => void;
  onEdit: (shortcut: Shortcut) => void;
  viewMode: 'grid' | 'list';
}

export const ShortcutCard: React.FC<ShortcutCardProps> = ({ shortcut, onRun, onDelete, onEdit, viewMode }) => {
  const Icon = getIconComponent(shortcut.icon);
  const isCustomIcon = shortcut.icon.startsWith('data:') || shortcut.icon.startsWith('http');

  const renderIcon = (size: number) => {
    if (isCustomIcon) {
      return (
        <img 
          src={shortcut.icon} 
          alt={shortcut.name} 
          className="w-full h-full object-cover"
          style={{ width: size, height: size }}
        />
      );
    }
    return <Icon size={size} />;
  };

  if (viewMode === 'list') {
    return (
      <div className="glass-card rounded-xl p-3 sm:p-4 flex items-center gap-4 group relative overflow-hidden transition-all hover:bg-white/60">
        {/* Icon */}
        <div className={`w-10 h-10 shrink-0 rounded-lg ${isCustomIcon ? 'bg-white/50 overflow-hidden p-1' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} flex items-center justify-center text-white shadow-md`}>
           {renderIcon(isCustomIcon ? 32 : 20)}
        </div>

        {/* Text Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base leading-tight truncate pr-2">
            {shortcut.name}
          </h3>
          <p className="text-xs text-gray-500 font-mono mt-0.5 truncate opacity-80" title={shortcut.path}>
            {shortcut.path}
          </p>
        </div>

        {/* Actions - Always visible on mobile, hover on desktop */}
        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus-within:opacity-100">
          <button 
            onClick={() => onRun(shortcut)}
            className="flex items-center gap-1.5 bg-gray-900/80 hover:bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm whitespace-nowrap"
          >
            <Play size={12} fill="currentColor" />
            <span className="hidden sm:inline">Run</span>
          </button>
          <button
            onClick={() => onEdit(shortcut)}
            className="p-1.5 bg-white/50 hover:bg-white/80 text-gray-700 rounded-lg transition-colors border border-white/40 shadow-sm"
            title="Edit Shortcut"
          >
            <Pencil size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(shortcut.id); }}
            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  }

  // Grid View Layout
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col h-full group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
         <button 
          onClick={(e) => { e.stopPropagation(); onDelete(shortcut.id); }}
          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-full transition-colors backdrop-blur-sm"
          title="Delete Shortcut"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${isCustomIcon ? 'bg-white/50 overflow-hidden p-1.5' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} flex items-center justify-center text-white shadow-lg shadow-blue-500/20`}>
          {renderIcon(isCustomIcon ? 40 : 24)}
        </div>
      </div>
      
      <div className="mb-1">
        <h3 className="font-semibold text-gray-800 text-lg leading-tight truncate" title={shortcut.name}>{shortcut.name}</h3>
        <p className="text-xs text-gray-500 font-mono mt-1 truncate" title={shortcut.path}>{shortcut.path}</p>
      </div>

      <div className="mt-auto pt-4 flex gap-2">
        <button 
          onClick={() => onRun(shortcut)}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-900/80 hover:bg-gray-900 text-white py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-gray-900/10"
        >
          <Play size={14} fill="currentColor" />
          Run
        </button>
        <button
          onClick={() => onEdit(shortcut)}
          className="p-2 bg-white/50 hover:bg-white/80 text-gray-700 rounded-lg transition-colors border border-white/40"
          title="Edit Shortcut"
        >
          <Pencil size={16} />
        </button>
      </div>
    </div>
  );
};