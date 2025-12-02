import React, { useRef } from 'react';
import { Terminal, Code, Globe, Coffee, Zap, Box, Layout, Server, Upload, Image as ImageIcon } from 'lucide-react';
import { IconType } from '../types';

interface IconPickerProps {
  selected: string;
  onSelect: (icon: string) => void;
}

const ICONS: { type: string; component: React.ElementType }[] = [
  { type: 'terminal', component: Terminal },
  { type: 'code', component: Code },
  { type: 'globe', component: Globe },
  { type: 'coffee', component: Coffee },
  { type: 'zap', component: Zap },
  { type: 'box', component: Box },
  { type: 'layout', component: Layout },
  { type: 'server', component: Server },
];

export const IconPicker: React.FC<IconPickerProps> = ({ selected, onSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onSelect(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isCustom = selected.startsWith('data:');

  return (
    <div className="flex gap-2 flex-wrap items-center">
      {ICONS.map(({ type, component: Icon }) => (
        <button
          key={type}
          type="button"
          onClick={() => onSelect(type)}
          className={`
            p-2 rounded-lg transition-all duration-200 flex items-center justify-center
            ${selected === type 
              ? 'bg-blue-500 text-white shadow-md transform scale-105' 
              : 'bg-white/30 text-gray-700 hover:bg-white/50'}
          `}
          title={type}
        >
          <Icon size={20} />
        </button>
      ))}

      {/* Divider */}
      <div className="w-px h-8 bg-gray-300 mx-1"></div>

      {/* Custom Upload Button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`
          p-2 rounded-lg transition-all duration-200 relative overflow-hidden group
          ${isCustom
            ? 'bg-blue-500 text-white shadow-md transform scale-105 ring-2 ring-blue-300 ring-offset-1 ring-offset-transparent' 
            : 'bg-white/30 text-gray-700 hover:bg-white/50 border border-dashed border-gray-400'}
        `}
        title="Upload Custom Icon"
      >
        {isCustom ? (
           <div className="w-5 h-5 flex items-center justify-center">
             <img src={selected} alt="Custom" className="w-full h-full object-cover rounded-sm" />
           </div>
        ) : (
          <Upload size={20} />
        )}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </button>
    </div>
  );
};

export const getIconComponent = (type: string) => {
  const found = ICONS.find(i => i.type === type);
  return found ? found.component : Terminal;
};
