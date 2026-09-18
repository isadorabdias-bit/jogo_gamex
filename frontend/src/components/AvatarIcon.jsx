import React from 'react';
import { Bot, Sparkles, Bird, Compass, Cat, Shield, Ghost, Flame } from 'lucide-react';

export const AVATAR_OPTIONS = [
  { id: 'robot', name: 'Robô Lógico', icon: Bot, bg: 'from-cyan-500 to-blue-600', color: 'text-cyan-200' },
  { id: 'wizard', name: 'Mago dos Números', icon: Sparkles, bg: 'from-purple-500 to-indigo-600', color: 'text-purple-200' },
  { id: 'owl', name: 'Coruja Sábia', icon: Bird, bg: 'from-amber-500 to-yellow-600', color: 'text-amber-200' },
  { id: 'astronaut', name: 'Explorador Espacial', icon: Compass, bg: 'from-emerald-500 to-teal-600', color: 'text-emerald-200' },
  { id: 'fox', name: 'Raposa Veloz', icon: Cat, bg: 'from-orange-500 to-red-600', color: 'text-orange-200' },
  { id: 'guardian', name: 'Guardião Matemático', icon: Shield, bg: 'from-blue-500 to-indigo-700', color: 'text-blue-200' },
  { id: 'alien', name: 'Gênio Cósmico', icon: Ghost, bg: 'from-fuchsia-500 to-pink-600', color: 'text-pink-200' },
  { id: 'fire', name: 'Chama do Conhecimento', icon: Flame, bg: 'from-rose-500 to-amber-600', color: 'text-rose-200' }
];

export default function AvatarIcon({ avatarId = 'robot', size = 'md', className = '' }) {
  const avatar = AVATAR_OPTIONS.find(a => a.id === avatarId) || AVATAR_OPTIONS[0];
  const Icon = avatar.icon;

  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5 text-xs',
    md: 'w-11 h-11 p-2 text-sm',
    lg: 'w-16 h-16 p-3 text-base',
    xl: 'w-24 h-24 p-5 text-xl'
  };

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${avatar.bg} flex items-center justify-center shadow-md border border-white/20 select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={avatar.name}
    >
      <Icon className="w-full h-full text-white drop-shadow-sm" />
    </div>
  );
}
