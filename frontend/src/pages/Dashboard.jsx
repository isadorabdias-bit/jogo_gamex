import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AvatarIcon from '../components/AvatarIcon';
import { 
  LayoutDashboard, 
  Trophy, 
  Award, 
  Target, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  Coins, 
  Star, 
  Lock, 
  Scale, 
  PieChart 
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.getDashboard();
      setDashboardData(res);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-300 font-bold text-sm">Carregando seus dados matemáticos...</p>
      </div>
    );
  }

  const { stats, badges, recentSessions, levelProgression } = dashboardData || {};

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Cabeçalho do Perfil do Aluno */}
      <div className="card-gaming flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <AvatarIcon avatarId={user?.avatar} size="xl" />
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-3xl font-black text-white">{user?.name}</h1>
              <span className="px-3 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 text-xs font-bold">
                {user?.grade || '7º Ano'}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              {user?.bio || 'Estudante focado em desafios matemáticos e conquistas no MathPlay!'}
            </p>
          </div>
        </div>

        {/* Nível e Barra de XP */}
        <div className="w-full md:w-72 bg-slate-900/90 p-4 rounded-2xl border border-slate-700 space-y-2">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-amber-400">Nível {levelProgression?.currentLevel || 1}</span>
            <span className="text-slate-400">{levelProgression?.xpInCurrentLevel || 0} / 150 XP</span>
          </div>

          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-brand-500 via-indigo-400 to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${levelProgression?.xpProgressPercent || 0}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold pt-1">
            <span>Progresso para Nível {(levelProgression?.currentLevel || 1) + 1}</span>
            <span className="font-bold text-amber-300">{levelProgression?.xpProgressPercent || 0}%</span>
          </div>
        </div>
      </div>

      {/* Grid de Estatísticas Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-gaming flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Star className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Estrelas na Trilha</span>
            <span className="text-2xl font-black text-white">{stats?.totalStars || 0}</span>
          </div>
        </div>

        <div className="card-gaming flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Taxa de Acertos</span>
            <span className="text-2xl font-black text-emerald-400">{stats?.overallAccuracy || 0}%</span>
          </div>
        </div>

        <div className="card-gaming flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Partidas Jogadas</span>
            <span className="text-2xl font-black text-white">{stats?.totalGames || 0}</span>
          </div>
        </div>

        <div className="card-gaming flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Maior Pontuação</span>
            <span className="text-2xl font-black text-amber-400">{stats?.highestScore || 0} pts</span>
          </div>
        </div>
      </div>

      {/* Mural de Conquistas e Insígnias */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            Galeria de Conquistas & Insígnias
          </h2>
          <span className="text-xs font-bold text-slate-400">
            {badges?.filter(b => b.is_unlocked).length} de {badges?.length} desbloqueadas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges?.map((badge) => {
            const isUnlocked = badge.is_unlocked === 1;

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-3xl border transition-all duration-200 ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-2xl border ${
                    isUnlocked
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-sm'
                      : 'bg-slate-800 text-slate-600 border-slate-700'
                  }`}>
                    <Award className="w-6 h-6" />
                  </div>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Conquistada
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" />
                      Bloqueada
                    </span>
                  )}
                </div>

                <h3 className={`font-bold text-base mb-1 ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                  {badge.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {badge.description}
                </p>

                <div className="text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span>Categoria: {badge.category}</span>
                  {isUnlocked && badge.unlocked_at && (
                    <span>{new Date(badge.unlocked_at).toLocaleDateString('pt-BR')}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Histórico Recente de Partidas */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-brand-400" />
          Histórico de Partidas Salvas no Banco de Dados
        </h2>

        {recentSessions?.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-slate-900/60 border border-slate-800">
            <p className="text-slate-400 text-sm">Você ainda não jogou nenhuma partida. Comece agora na Trilha!</p>
          </div>
        ) : (
          <div className="card-gaming overflow-x-auto p-0">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-700/80 bg-slate-800/50 text-slate-400 text-xs uppercase font-extrabold tracking-wider">
                  <th className="py-3.5 px-4">Jogo</th>
                  <th className="py-3.5 px-4">Dificuldade</th>
                  <th className="py-3.5 px-4">Pontuação</th>
                  <th className="py-3.5 px-4">Acertos/Erros</th>
                  <th className="py-3.5 px-4">Precisão</th>
                  <th className="py-3.5 px-4">XP Ganho</th>
                  <th className="py-3.5 px-4">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentSessions?.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-800/40 transition font-medium">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        {session.game_type === 'equacoes' ? (
                          <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-300">
                            <Scale className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                            <PieChart className="w-4 h-4" />
                          </div>
                        )}
                        <span className="font-bold text-white capitalize">
                          {session.game_type === 'equacoes' ? 'Caça ao Tesouro' : 'Mercado Financeiro'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        session.difficulty === 'facil'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : session.difficulty === 'medio'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {session.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-amber-400">
                      {session.score} pts
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <span className="text-emerald-400 font-bold">{session.correct_answers} acertos</span>
                      <span className="text-slate-500 mx-1">/</span>
                      <span className="text-rose-400 font-bold">{session.wrong_answers} erros</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-200">
                        {Math.round((session.accuracy || 0) * 100)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-300">
                      +{session.xp_earned} XP
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {new Date(session.played_at).toLocaleDateString('pt-BR')} às {new Date(session.played_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
