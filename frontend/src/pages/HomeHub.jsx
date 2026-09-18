import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import { 
  Map, 
  Lock, 
  CheckCircle2, 
  Star, 
  Play, 
  Scale, 
  PieChart, 
  Sparkles, 
  Trophy, 
  ArrowRight,
  Flame
} from 'lucide-react';

const STAGES_METADATA = [
  {
    id: 1,
    title: 'Caça ao Tesouro',
    subtitle: 'Caça ao Tesouro • Fase 1',
    gameType: 'equacoes',
    difficulty: 'facil',
    icon: Scale,
    description: 'Resolva as contas para superar obstáculos, abrir o caminho e chegar ao tesouro escondido.',
    gradient: 'from-brand-600 to-indigo-600'
  },
  {
    id: 2,
    title: 'Mercado do Bairro',
    subtitle: 'Mercado Financeiro • Fase 1',
    gameType: 'fracoes',
    difficulty: 'facil',
    icon: PieChart,
    description: 'Calcule descontos, troco, juros e valores do mercado para manter o caixa em ordem.',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 3,
    title: 'Caminho do Tesouro',
    subtitle: 'Caça ao Tesouro • Médio',
    gameType: 'equacoes',
    difficulty: 'medio',
    icon: Scale,
    description: 'Enfrente obstáculos mais difíceis e descubra o valor das chaves para avançar no percurso.',
    gradient: 'from-blue-600 to-cyan-600'
  },
  {
    id: 4,
    title: 'Caixa do Mercado',
    subtitle: 'Mercado Financeiro • Médio',
    gameType: 'fracoes',
    difficulty: 'medio',
    icon: PieChart,
    description: 'Explore porcentagens, juros e comparação de ofertas para tomar decisões inteligentes.',
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    id: 5,
    title: 'Tesouro Final',
    subtitle: 'Caça ao Tesouro • Difícil',
    gameType: 'equacoes',
    difficulty: 'dificil',
    icon: Scale,
    description: 'Aposte no raciocínio para resolver desafios avançados e conquistar o maior prêmio do mapa.',
    gradient: 'from-rose-600 to-red-600'
  },
  {
    id: 6,
    title: 'Fechamento do Dia',
    subtitle: 'Mercado Financeiro • Difícil',
    gameType: 'fracoes',
    difficulty: 'dificil',
    icon: PieChart,
    description: 'Domine descontos combinados, juros e cálculos de total para fechar as contas do mercado.',
    gradient: 'from-emerald-600 to-teal-600'
  }
];

export default function HomeHub({ onStartGame }) {
  const { user } = useAuth();
  const [trackData, setTrackData] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrack();
  }, []);

  const loadTrack = async () => {
    try {
      const res = await api.getDashboard();
      if (res && res.learningTrack) {
        setTrackData(res.learningTrack);
      }
    } catch (err) {
      console.warn('Erro ao carregar trilha:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStageStatus = (stageId) => {
    const stage = trackData.find(s => s.stage_id === stageId);
    if (!stage) {
      return stageId === 1 ? { status: 'unlocked', stars: 0, bestScore: 0 } : { status: 'locked', stars: 0, bestScore: 0 };
    }
    return {
      status: stage.status,
      stars: stage.stars,
      bestScore: stage.best_score
    };
  };

  const handleStageClick = (meta) => {
    sound.playClick();
    const info = getStageStatus(meta.id);
    if (info.status === 'locked') return;
    setSelectedStage({ ...meta, ...info });
  };

  const handleLaunchStage = (stage) => {
    sound.playClick();
    onStartGame({
      gameType: stage.gameType,
      difficulty: stage.difficulty,
      stageId: stage.id
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      
      {/* Banner de Boas-vindas Gamificado */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 border border-brand-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Trilha do Conhecimento Matemático
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">{user?.name?.split(' ')[0] || 'Gamer'}</span>!
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Avance pelos mundos da Álgebra e da Aritmética. Conquiste estrelas, suba de nível e prove que a Matemática pode ser seu maior superpoder!
          </p>
        </div>

        {/* Efeito decorativo de fundo */}
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-12 translate-y-8">
          <Scale className="w-80 h-80 text-brand-400" />
        </div>
      </div>

      {/* Acesso Rápido aos 2 Jogos (Catálogo Livre) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Catálogo de Jogos (Modo Livre)
          </h2>
          <span className="text-xs text-slate-400 font-semibold">Ensino Fundamental II</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Jogo 1 */}
          <div className="group relative overflow-hidden rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-brand-500/60 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30 group-hover:scale-110 transition">
                <Scale className="w-8 h-8" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30">
                Obstáculos
              </span>
            </div>

            <h3 className="text-2xl font-black text-white mt-4 mb-2">Caça ao Tesouro</h3>
            <p className="text-sm text-slate-300 mb-6">
              Passe pelos obstáculos resolvendo as contas para abrir caminhos, quebrar barreiras e chegar ao tesouro!
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700/60">
              <div className="flex gap-1.5">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300">Dicas</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300">Feedback Didático</span>
              </div>
              <button
                onClick={() => onStartGame({ gameType: 'equacoes', difficulty: 'facil' })}
                className="btn-game-primary flex items-center gap-2 text-sm py-2 px-4"
              >
                <Play className="w-4 h-4 fill-white" />
                Jogar
              </button>
            </div>
          </div>

          {/* Card Jogo 2 */}
          <div className="group relative overflow-hidden rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-500/60 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition">
                <PieChart className="w-8 h-8" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Finanças
              </span>
            </div>

            <h3 className="text-2xl font-black text-white mt-4 mb-2">Mercado Financeiro</h3>
            <p className="text-sm text-slate-300 mb-6">
              Veja juros, troco, descontos e porcentagens em ação para dominar as contas do mercado e do caixa!
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700/60">
              <div className="flex gap-1.5">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300">Dicas</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300">Gráficos SVG</span>
              </div>
              <button
                onClick={() => onStartGame({ gameType: 'fracoes', difficulty: 'facil' })}
                className="btn-game-accent flex items-center gap-2 text-sm py-2 px-4"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                Jogar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa da Trilha de Fases (Estilo Duolingo / World Map) */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Map className="w-6 h-6 text-brand-400" />
              Mapa de Progressão da Trilha
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete as fases para desbloquear novos desafios e conquistar até 3 estrelas por estação!
            </p>
          </div>
        </div>

        {/* Trilha de Nós Conectados */}
        <div className="relative py-8 px-4 bg-slate-950/60 rounded-3xl border border-slate-800">
          <div className="flex flex-col items-center gap-8 relative z-10">
            {STAGES_METADATA.map((stage, index) => {
              const statusInfo = getStageStatus(stage.id);
              const isLocked = statusInfo.status === 'locked';
              const isCompleted = statusInfo.status === 'completed';
              const Icon = stage.icon;

              // Alterna levemente a posição horizontal para criar o efeito serpenteante de trilha
              const offsetClass = index % 2 === 0 ? 'sm:-translate-x-12' : 'sm:translate-x-12';

              return (
                <div
                  key={stage.id}
                  className={`flex flex-col items-center transition transform duration-300 ${offsetClass}`}
                >
                  {/* Linha conectora entre as fases */}
                  {index > 0 && (
                    <div className="w-1.5 h-10 bg-gradient-to-b from-brand-500/50 to-indigo-500/50 -mt-6 mb-2 rounded-full" />
                  )}

                  {/* Nó da Fase */}
                  <div
                    onClick={() => handleStageClick(stage)}
                    className={`relative cursor-pointer group p-1 rounded-3xl transition-all duration-300 ${
                      isLocked 
                        ? 'opacity-60 cursor-not-allowed' 
                        : 'hover:scale-105 active:scale-95'
                    }`}
                  >
                    {/* Anel de destaque para fase desbloqueada atual */}
                    {!isLocked && !isCompleted && (
                      <div className="absolute inset-0 rounded-3xl bg-brand-500/40 blur-md pulse-ring" />
                    )}

                    <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex flex-col items-center justify-center shadow-2xl border-2 transition ${
                      isLocked
                        ? 'bg-slate-800 border-slate-700 text-slate-500'
                        : isCompleted
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-400 text-white shadow-emerald-600/30'
                        : `bg-gradient-to-br ${stage.gradient} border-white/50 text-white shadow-brand-500/40`
                    }`}>
                      {isLocked ? (
                        <Lock className="w-8 h-8 text-slate-500" />
                      ) : isCompleted ? (
                        <CheckCircle2 className="w-10 h-10 text-emerald-200" />
                      ) : (
                        <Icon className="w-9 h-9 drop-shadow" />
                      )}

                      <span className="text-[10px] font-black uppercase tracking-wider mt-1">
                        Fase {stage.id}
                      </span>
                    </div>

                    {/* Estrelas conquistadas */}
                    <div className="flex justify-center gap-1 mt-2">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-4 h-4 ${
                            starIdx <= statusInfo.stars
                              ? 'text-amber-400 fill-amber-400 drop-shadow'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Rótulo da Fase */}
                  <div className="text-center mt-2 max-w-[200px]">
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                      {stage.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 block">
                      {stage.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes e Início da Fase */}
      {selectedStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-brand-500/50 rounded-3xl p-6 shadow-2xl text-center">
            <div className={`inline-flex p-4 rounded-3xl bg-gradient-to-br ${selectedStage.gradient} text-white shadow-xl mb-4`}>
              {selectedStage.gameType === 'equacoes' ? (
                <Scale className="w-10 h-10" />
              ) : (
                <PieChart className="w-10 h-10" />
              )}
            </div>

            <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 inline-block mb-2">
              Fase {selectedStage.id} • Dificuldade {selectedStage.difficulty.toUpperCase()}
            </span>

            <h3 className="text-2xl font-black text-white mb-1">{selectedStage.title}</h3>
            <p className="text-xs text-slate-400 font-semibold mb-4">{selectedStage.subtitle}</p>

            <p className="text-sm text-slate-300 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 text-left mb-6">
              {selectedStage.description}
            </p>

            {/* Estrelas atuais da fase */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 mb-6">
              <span className="text-xs font-bold text-slate-400">Sua melhor classificação:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-5 h-5 ${
                      starIdx <= selectedStage.stars
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedStage(null)}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition"
              >
                Voltar
              </button>
              <button
                onClick={() => handleLaunchStage(selectedStage)}
                className="flex-1 btn-game-primary flex items-center justify-center gap-2 text-sm"
              >
                <Play className="w-4 h-4 fill-white" />
                Iniciar Fase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
