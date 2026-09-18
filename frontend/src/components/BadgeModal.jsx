import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Star, X, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

export default function BadgeModal({ badges = [], onClose }) {
  useEffect(() => {
    if (badges.length > 0) {
      sound.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [badges]);

  if (!badges || badges.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-400/80 rounded-3xl p-6 shadow-2xl text-center transform animate-bounce-short">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-700/50 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-xl mb-4 animate-float">
          <Award className="w-12 h-12" />
        </div>

        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
          CONQUISTA DESBLOQUEADA!
        </h3>
        <p className="text-sm text-slate-300 mt-1 mb-6">
          Você atingiu um marco incrível de dedicação e aprendizado!
        </p>

        <div className="space-y-3 mb-6">
          {badges.map((b) => (
            <div
              key={b.id || b.code}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/90 border border-amber-500/30 text-left"
            >
              <div className="p-3 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  {b.name}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    +{b.category}
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">{b.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full btn-game-accent text-base"
        >
          Incrível! Continuar
        </button>
      </div>
    </div>
  );
}
