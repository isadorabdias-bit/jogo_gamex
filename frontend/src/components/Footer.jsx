import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950/80 py-8 text-center text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
        <div className="flex items-center justify-center gap-2 font-bold text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>MathPlay Solutions • Educação Matemática Gamificada</span>
        </div>
        <p className="text-slate-500">
          Desenvolvido com foco no Ensino Fundamental II (6º ao 9º ano) • Alinhado às diretrizes pedagógicas da BNCC.
        </p>
        <p className="text-[11px] text-slate-600">
          Banco de Dados Relacional SQLite • Express API • React SPA • Sessão Persistente JWT
        </p>
      </div>
    </footer>
  );
}
