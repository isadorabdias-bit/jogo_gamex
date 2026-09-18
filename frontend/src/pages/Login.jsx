import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import { Sparkles, LogIn, User, Lock, ArrowRight, Bot, GraduationCap } from 'lucide-react';

export default function Login({ onGoToRegister, onLoginSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    sound.playClick();
    setLoading(true);
    setErrorMsg('');

    try {
      await login(email, password);
      sound.playCorrect();
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      sound.playWrong();
      setErrorMsg(err.message || 'Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (role) => {
    sound.playClick();
    if (role === 'aluno') {
      setEmail('aluno@mathplay.com');
      setPassword('senha123');
    } else {
      setEmail('professor@mathplay.com');
      setPassword('senha123');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-10 animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        
        {/* Topo do Formulário */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-400 text-white shadow-xl shadow-brand-500/20 mb-2">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white">Bem-vindo de volta!</h1>
          <p className="text-xs text-slate-400">
            Entre na sua conta para continuar sua jornada na trilha matemática.
          </p>
        </div>

        {/* Botões de Acesso Rápido Demonstrativo */}
        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block text-center">
            Acesso Rápido para Avaliação:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('aluno')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-400/30 text-xs font-bold transition"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              Aluno Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('professor')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 text-xs font-bold transition"
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              Professor Demo
            </button>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="card-gaming space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="exemplo@mathplay.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-game-primary flex items-center justify-center gap-2 text-sm mt-2"
          >
            {loading ? (
              <span>Entrando...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Entrar na Plataforma</span>
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-400">Ainda não tem uma conta? </span>
            <button
              type="button"
              onClick={onGoToRegister}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 underline"
            >
              Criar Conta Gratuita
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
