import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import AvatarIcon, { AVATAR_OPTIONS } from '../components/AvatarIcon';
import { Sparkles, UserPlus, User, Lock, Mail, GraduationCap, Bot } from 'lucide-react';

export default function Register({ onGoToLogin, onRegisterSuccess }) {
  const { register } = useAuth();

  const [role, setRole] = useState('aluno');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState('7º Ano');
  const [avatar, setAvatar] = useState('robot');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    sound.playClick();
    setLoading(true);
    setErrorMsg('');

    try {
      await register({
        name,
        email,
        password,
        role,
        grade,
        avatar
      });
      sound.playVictory();
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err) {
      sound.playWrong();
      setErrorMsg(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-10 animate-fade-in">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Topo */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-400 text-white shadow-xl mb-2">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white">Criar Nova Conta</h1>
          <p className="text-xs text-slate-400">
            Junte-se ao MathPlay Solutions e comece a subir no ranking matemático!
          </p>
        </div>

        {/* Escolha de Perfil: Aluno ou Professor */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setRole('aluno');
            }}
            className={`p-3.5 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-xs transition ${
              role === 'aluno'
                ? 'bg-brand-600/30 border-brand-400 text-white shadow-lg'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            Perfil Aluno
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setRole('professor');
            }}
            className={`p-3.5 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-xs transition ${
              role === 'professor'
                ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            Perfil Professor
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="card-gaming space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
              Nome Completo
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Ex: Lucas Gabriel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="seuemail@escola.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
              Senha (mínimo 6 caracteres)
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

          {/* Série Escolar */}
          {role === 'aluno' && (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                Ano / Série
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500 transition"
              >
                <option value="6º Ano">6º Ano do Ensino Fundamental II</option>
                <option value="7º Ano">7º Ano do Ensino Fundamental II</option>
                <option value="8º Ano">8º Ano do Ensino Fundamental II</option>
                <option value="9º Ano">9º Ano do Ensino Fundamental II</option>
              </select>
            </div>
          )}

          {/* Avatar Inicial */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
              Escolha seu Avatar Inicial
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_OPTIONS.slice(0, 4).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setAvatar(opt.id);
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                    avatar === opt.id
                      ? 'border-amber-400 bg-amber-400/10'
                      : 'border-slate-700 bg-slate-900/60'
                  }`}
                >
                  <AvatarIcon avatarId={opt.id} size="sm" />
                  <span className="text-[10px] text-slate-300 font-bold">{opt.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-game-accent flex items-center justify-center gap-2 text-sm mt-4"
          >
            {loading ? (
              <span>Cadastrando...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Finalizar Cadastro e Jogar</span>
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-400">Já possui uma conta? </span>
            <button
              type="button"
              onClick={onGoToLogin}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 underline"
            >
              Fazer Login
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
