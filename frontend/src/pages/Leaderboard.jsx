import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AvatarIcon from '../components/AvatarIcon';
import { Trophy, Medal, Star, Award, Sparkles } from 'lucide-react';

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const res = await api.getLeaderboard();
      if (res && res.leaderboard) {
        setLeaderboard(res.leaderboard);
      }
    } catch (err) {
      console.error('Erro ao carregar ranking:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-300 font-bold text-sm">Carregando o Ranking dos Mestres...</p>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Título */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-2">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Hall da Fama da Matemática
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Os alunos com maior dedicação, XP acumulado e medalhas conquistadas no MathPlay Solutions!
        </p>
      </div>

      {/* Pódio dos 3 Primeiros Colocados */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-8 pb-4">
          
          {/* 2º Lugar (Prata) */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <AvatarIcon avatarId={topThree[1].avatar} size="lg" />
              <div className="absolute -top-3 -right-2 w-7 h-7 rounded-full bg-slate-300 text-slate-900 border-2 border-white flex items-center justify-center font-black text-xs shadow">
                2º
              </div>
            </div>
            <span className="font-bold text-sm text-white truncate max-w-[100px] sm:max-w-none">
              {topThree[1].name}
            </span>
            <span className="text-xs text-amber-300 font-extrabold">{topThree[1].xp} XP</span>
            <div className="w-full h-24 sm:h-32 mt-3 rounded-t-2xl bg-gradient-to-t from-slate-800 to-slate-700/80 border-t-4 border-slate-300 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-300">Nível {topThree[1].level}</span>
            </div>
          </div>

          {/* 1º Lugar (Ouro) */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-400 animate-bounce">
                <Trophy className="w-6 h-6" />
              </div>
              <AvatarIcon avatarId={topThree[0].avatar} size="xl" className="ring-4 ring-amber-400/80 shadow-amber-400/40" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 text-slate-950 border-2 border-white flex items-center justify-center font-black text-sm shadow">
                1º
              </div>
            </div>
            <span className="font-black text-base text-white truncate max-w-[120px] sm:max-w-none">
              {topThree[0].name}
            </span>
            <span className="text-sm text-amber-300 font-black">{topThree[0].xp} XP</span>
            <div className="w-full h-32 sm:h-44 mt-3 rounded-t-2xl bg-gradient-to-t from-amber-600/60 to-amber-500/80 border-t-4 border-amber-300 flex flex-col items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-xs font-black text-slate-950 px-2 py-0.5 rounded-full bg-white/80">
                Campeão Atual
              </span>
              <span className="text-xs font-bold text-white mt-1">Nível {topThree[0].level}</span>
            </div>
          </div>

          {/* 3º Lugar (Bronze) */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <AvatarIcon avatarId={topThree[2].avatar} size="lg" />
              <div className="absolute -top-3 -right-2 w-7 h-7 rounded-full bg-amber-700 text-amber-100 border-2 border-white flex items-center justify-center font-black text-xs shadow">
                3º
              </div>
            </div>
            <span className="font-bold text-sm text-white truncate max-w-[100px] sm:max-w-none">
              {topThree[2].name}
            </span>
            <span className="text-xs text-amber-300 font-extrabold">{topThree[2].xp} XP</span>
            <div className="w-full h-20 sm:h-24 mt-3 rounded-t-2xl bg-gradient-to-t from-slate-800 to-amber-900/40 border-t-4 border-amber-700 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-300">Nível {topThree[2].level}</span>
            </div>
          </div>

        </div>
      )}

      {/* Tabela do Ranking Completo */}
      <div className="card-gaming overflow-x-auto p-0">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-700/80 bg-slate-800/60 text-slate-400 text-xs uppercase font-extrabold tracking-wider">
              <th className="py-3 px-4 text-center">Posição</th>
              <th className="py-3 px-4">Estudante</th>
              <th className="py-3 px-4">Série</th>
              <th className="py-3 px-4">Nível</th>
              <th className="py-3 px-4">Medalhas</th>
              <th className="py-3 px-4">Estrelas</th>
              <th className="py-3 px-4 text-right">XP Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {leaderboard.map((student, idx) => {
              const isCurrentUser = user?.id === student.id;

              return (
                <tr
                  key={student.id}
                  className={`transition font-medium ${
                    isCurrentUser
                      ? 'bg-brand-500/20 border-l-4 border-brand-400'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3 px-4 text-center font-black text-slate-300">
                    {idx === 0 ? '🥇 1º' : idx === 1 ? '🥈 2º' : idx === 2 ? '🥉 3º' : `${idx + 1}º`}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <AvatarIcon avatarId={student.avatar} size="sm" />
                      <div>
                        <span className="font-bold text-white flex items-center gap-1.5">
                          {student.name}
                          {isCurrentUser && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-600 text-white">
                              Você
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-400">
                    {student.grade || '7º Ano'}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-300">
                    Nível {student.level}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{student.badges_count}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{student.total_stars}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-black text-amber-400">
                    {student.xp} XP
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
