import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AvatarIcon from './AvatarIcon';
import { sound } from '../utils/audio';
import { 
  Sparkles, 
  Trophy, 
  Map, 
  LayoutDashboard, 
  GraduationCap, 
  LogOut, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  User, 
  Coins, 
  Scale, 
  PieChart 
} from 'lucide-react';

export default function Navbar({ currentView, setCurrentView }) {
  const { user, logout, isTeacher } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleAudio = () => {
    const state = sound.toggle();
    setSoundActive(state);
    if (state) sound.playClick();
  };

  const handleNav = (view) => {
    sound.playClick();
    setCurrentView(view);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const navItems = [
    { id: 'hub', label: 'Trilha de Fases', icon: Map },
    { id: 'game-equacoes', label: 'Caça ao Tesouro', icon: Scale },
    { id: 'game-fracoes', label: 'Mercado Financeiro', icon: PieChart },
    { id: 'dashboard', label: 'Meu Progresso', icon: LayoutDashboard },
    { id: 'leaderboard', label: 'Ranking', icon: Trophy },
  ];

  if (isTeacher) {
    navItems.push({ id: 'teacher', label: 'Painel do Professor', icon: GraduationCap });
  }

  // XP progression calculation
  const currentXp = user?.xp || 0;
  const currentLevel = user?.level || 1;
  const xpInLevel = currentXp % 150;
  const xpPercent = Math.min(100, Math.round((xpInLevel / 150) * 100));

  return (
    <nav
      className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg"
      role="navigation"
      aria-label="Navegação principal MathPlay Solutions"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo e Nome */}
          <button
            onClick={() => handleNav('hub')}
            className="flex items-center gap-3 cursor-pointer group select-none bg-transparent border-0 p-0"
            aria-label="MathPlay Solutions — Ir para a Trilha de Fases"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-accent-yellow flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition transform" aria-hidden="true">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-amber-300">
                MathPlay
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Solutions • Ensino Fundamental II
              </span>
            </div>
          </button>

          {/* Links Desktop */}
          <div className="hidden lg:flex items-center gap-1.5" role="menubar" aria-label="Menu principal">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`${item.label}${isActive ? ' (página atual)' : ''}`}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </div>


          {/* Barra de Status do Aluno e Ações */}
          <div className="flex items-center gap-3">
            {/* Botão de Som */}
            <button
              onClick={toggleAudio}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 transition"
              aria-label={soundActive ? 'Desativar sons do jogo' : 'Ativar sons do jogo'}
              aria-pressed={soundActive}
              title={soundActive ? 'Desativar Sons' : 'Ativar Sons'}
            >
              {soundActive ? <Volume2 className="w-5 h-5 text-amber-400" aria-hidden="true" /> : <VolumeX className="w-5 h-5 text-slate-500" aria-hidden="true" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {/* Pílula de XP e Nível */}
                <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700" aria-label={`Nível ${currentLevel}, ${xpInLevel} de 150 XP, ${user.coins || 0} moedas`} role="status">
                  <div className="flex items-center gap-1.5 font-black text-xs text-amber-400">
                    <span className="px-2 py-0.5 rounded-lg bg-amber-400/20 border border-amber-400/30 text-amber-300">
                      Nível {currentLevel}
                    </span>
                  </div>

                  {/* Barra de XP */}
                  <div className="w-20 sm:w-24">
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold mb-0.5">
                      <span>XP</span>
                      <span>{xpInLevel}/150</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden" role="progressbar" aria-valuenow={xpInLevel} aria-valuemin={0} aria-valuemax={150} aria-label="Progresso de XP">
                      <div
                        className="bg-gradient-to-r from-brand-500 to-amber-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${xpPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Moedas */}
                  <div className="flex items-center gap-1 text-xs font-black text-amber-300 pl-1 border-l border-slate-700">
                    <Coins className="w-4 h-4 text-amber-400 fill-amber-400/40" aria-hidden="true" />
                    <span>{user.coins || 0}</span>
                  </div>
                </div>

                {/* Perfil & Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
                    aria-label={`Menu do usuário ${user.name}`}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="menu"
                  >

                    <AvatarIcon avatarId={user.avatar} size="sm" />
                    <span className="text-xs font-bold text-slate-200 hidden md:inline pr-1">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-slate-700/60">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                          {user.role === 'professor' ? 'Professor' : `Aluno (${user.grade || '7º Ano'})`}
                        </span>
                      </div>

                      <button
                        onClick={() => handleNav('profile')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition"
                      >
                        <User className="w-4 h-4 text-brand-400" />
                        Editar Meu Perfil
                      </button>

                      <button
                        onClick={() => handleNav('dashboard')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-400" />
                        Meu Progresso
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition border-t border-slate-700/60 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair da Conta
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white"
                >
                  Entrar
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-4 py-2 text-sm font-bold rounded-xl bg-brand-600 hover:bg-brand-500 text-white"
                >
                  Cadastre-se
                </button>
              </div>
            )}

            {/* Hambúrguer Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition ${
                  isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
