import React from 'react';

export interface Shortcut {
  id: string;
  name: string;
  description?: string;
  path: string;
  command: string;
  icon: string; // Emoji, Lucide icon name, or Base64 image
  port?: string;
  category: 'development' | 'production' | 'utility';
  createdAt: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export type IconType = string;