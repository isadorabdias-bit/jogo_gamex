import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import BadgeModal from '../components/BadgeModal';
import confetti from 'canvas-confetti';
import { 
  PieChart, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Star, 
  Trophy, 
  Flame, 
  BookOpen, 
  Percent 
} from 'lucide-react';

/**
 * Componente gráfico SVG para renderizar fatias de pizza com precisão matemática
 */
function SvgPizza({ totalSlices = 4, coloredSlices = 3, color = '#F59E0B' }) {
  const radius = 70;
  const center = 80;

  const slices = [];
  const angleStep = (2 * Math.PI) / totalSlices;

  for (let i = 0; i < totalSlices; i++) {
    const startAngle = i * angleStep - Math.PI / 2;
    const endAngle = (i + 1) * angleStep - Math.PI / 2;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArcFlag = angleStep > Math.PI ? 1 : 0;
    const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    const isColored = i < coloredSlices;

    slices.push(
      <path
        key={i}
        d={pathData}
        fill={isColored ? color : '#334155'}
        stroke="#1E293B"
        strokeWidth="3"
        className="transition-all duration-300 hover:opacity-90"
      />
    );
  }

  return (
    <svg width="160" height="160" viewBox="0 0 160 160" className="drop-shadow-lg mx-auto">
      {slices}
      <circle cx={center} cy={center} r="6" fill="#F8FAFC" />
    </svg>
  );
}

/**
 * Componente gráfico para renderizar barra de unidades particionada
 */
function SvgBar({ totalUnits = 5, coloredUnits = 2, color = '#3B82F6' }) {
  return (
    <div className="w-full max-w-sm mx-auto p-2 bg-slate-900 rounded-2xl border-2 border-slate-700 shadow-inner">
      <div className="grid grid-flow-col auto-cols-fr gap-1.5 h-14">
        {Array.from({ length: totalUnits }).map((_, idx) => (
          <div
            key={idx}
            style={{ backgroundColor: idx < coloredUnits ? color : '#1E293B' }}
            className="rounded-xl border border-white/20 flex items-center justify-center font-bold text-xs text-white shadow-sm transition-colors duration-300"
          >
            {idx < coloredUnits ? '1' : ''}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold px-2 mt-2">
        <span>Partes coloridas: {coloredUnits}</span>
        <span>Total: {totalUnits}</span>
      </div>
    </div>
  );
}

export default function FractionGame({ stageId = null, initialDifficulty = 'facil', onBackToHub }) {
  const { refreshUser } = useAuth();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Estado da rodada
  const [selectedOption, setSelectedOption] = useState(null);
  const [revealedHints, setRevealedHints] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Métricas
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [gameFinished, setGameFinished] = useState(false);
  const [finishData, setFinishData] = useState(null);
  const [newBadges, setNewBadges] = useState([]);

  useEffect(() => {
    loadQuestions(difficulty);
  }, [difficulty]);

  const loadQuestions = async (diff) => {
    setLoading(true);
    try {
      const res = await api.getQuestions('fracoes', diff);
      if (res && res.questions) {
        setQuestions(res.questions);
        setCurrentIndex(0);
        resetRound();
        setScore(0);
        setStreak(0);
        setCorrectCount(0);
        setWrongCount(0);
        setStartTime(Date.now());
        setGameFinished(false);
      }
    } catch (err) {
      console.error('Erro ao carregar questões de frações:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetRound = () => {
    setSelectedOption(null);
    setRevealedHints(0);
    setShowExplanation(false);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const currentQ = questions[currentIndex];

  const handleRevealHint = () => {
    if (revealedHints < 3) {
      sound.playClick();
      setRevealedHints(prev => prev + 1);
    }
  };

  const handleSelectOption = (opt) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const correct = String(opt).trim() === String(currentQ.solution).trim();
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      const streakBonus = streak * 20;
      const hintPenalty = revealedHints * 20;
      const roundPoints = Math.max(50, 100 + streakBonus - hintPenalty);

      setScore(prev => prev + roundPoints);
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
    } else {
      sound.playWrong();
      setStreak(0);
      setWrongCount(prev => prev + 1);
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      resetRound();
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    const durationSeconds = Math.round((Date.now() - startTime) / 1000);

    try {
      const res = await api.saveSession({
        gameType: 'fracoes',
        score,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        difficulty,
        durationSeconds,
        stageId
      });

      setFinishData(res);
      setGameFinished(true);
      sound.playVictory();

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });

      if (res.newBadges && res.newBadges.length > 0) {
        setNewBadges(res.newBadges);
      }

      await refreshUser();
    } catch (err) {
      console.error('Erro ao salvar partida de frações:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-base font-bold text-slate-300">Carregando o Mercado Financeiro...</p>
      </div>
    );
  }

  if (gameFinished && finishData) {
    const accuracyPercent = Math.round(finishData.accuracy * 100);
    let starsEarned = 1;
    if (accuracyPercent >= 100) starsEarned = 3;
    else if (accuracyPercent >= 70) starsEarned = 2;

    return (
      <div className="max-w-xl mx-auto my-8 p-6 sm:p-8 bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl text-center animate-fade-in">
        <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-xl mb-4">
          <Trophy className="w-14 h-14" />
        </div>

        <h2 className="text-3xl font-black text-white mb-2">Desafio de Frações Concluído!</h2>
        <p className="text-slate-300 text-sm mb-6">
          Mercado Financeiro • Nível {difficulty.toUpperCase()}
        </p>

        {/* Estrelas */}
        <div className="flex justify-center gap-3 mb-6">
          {[1, 2, 3].map((starIndex) => (
            <Star
              key={starIndex}
              className={`w-10 h-10 ${
                starIndex <= starsEarned
                  ? 'text-amber-400 fill-amber-400 drop-shadow-md animate-bounce'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 bg-slate-800 rounded-2xl border border-slate-700">
            <span className="text-xs text-slate-400 font-bold block">Pontuação</span>
            <span className="text-2xl font-black text-amber-400">{finishData.score}</span>
          </div>
          <div className="p-3.5 bg-slate-800 rounded-2xl border border-slate-700">
            <span className="text-xs text-slate-400 font-bold block">Precisão</span>
            <span className="text-2xl font-black text-emerald-400">{accuracyPercent}%</span>
          </div>
          <div className="p-3.5 bg-slate-800 rounded-2xl border border-slate-700">
            <span className="text-xs text-slate-400 font-bold block">XP Ganho</span>
            <span className="text-2xl font-black text-brand-400">+{finishData.xpEarned}</span>
          </div>
        </div>

        {finishData.didLevelUp && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-brand-500/20 to-amber-500/20 border border-amber-400/50">
            <span className="text-lg font-black text-amber-300 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              PARABÉNS! VOCÊ EVOLUIU PARA O NÍVEL {finishData.level}!
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => loadQuestions(difficulty)}
            className="flex-1 btn-game-primary flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Jogar Novamente
          </button>
          <button
            onClick={onBackToHub}
            className="flex-1 btn-game-accent flex items-center justify-center gap-2"
          >
            Voltar à Trilha
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <BadgeModal badges={newBadges} onClose={() => setNewBadges([])} />
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      
      {/* Topo de Status do Jogo */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-slate-800/80 border border-slate-700 backdrop-blur-md">
        
        {/* Seletor de Dificuldade Adaptativa */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nível:</span>
          {['facil', 'medio', 'dificil'].map((diff) => (
            <button
              key={diff}
              onClick={() => {
                sound.playClick();
                setDifficulty(diff);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-black capitalize transition ${
                difficulty === diff
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {diff === 'facil' ? 'Fácil' : diff === 'medio' ? 'Médio' : 'Difícil'}
            </button>
          ))}
        </div>

        {/* Questão atual e Pontuação */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300">
            <span>Fase:</span>
            <span className="text-amber-400 font-extrabold">{currentIndex + 1}/{questions.length}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>{score} pts</span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-orange-500/20 border border-orange-500/40 text-xs font-black text-orange-400 animate-pulse">
              <Flame className="w-4 h-4 fill-orange-400" />
              <span>{streak}x Combo</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Visual Central do Desafio */}
      <div className="card-gaming relative overflow-hidden text-center py-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
          <PieChart className="w-4 h-4 text-amber-400" />
          Aritmética e Geometria Visual
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white max-w-xl mx-auto my-3">
          {currentQ.prompt}
        </h3>

        {/* Representações Visuais Interativas */}
        <div className="my-6">
          {currentQ.visualType === 'pizza' && (
            <SvgPizza
              totalSlices={currentQ.visualData.totalSlices}
              coloredSlices={currentQ.visualData.coloredSlices}
              color={currentQ.visualData.primaryColor}
            />
          )}

          {currentQ.visualType === 'bar' && (
            <SvgBar
              totalUnits={currentQ.visualData.totalUnits}
              coloredUnits={currentQ.visualData.coloredUnits}
              color={currentQ.visualData.primaryColor}
            />
          )}

          {currentQ.visualType === 'comparison' && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700">
                <span className="text-xs text-slate-400 block mb-2">Fração Referência</span>
                <span className="text-3xl font-black text-brand-400">1 / 2</span>
              </div>
              <span className="text-xl font-black text-amber-400">= ?</span>
              <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40">
                <span className="text-xs text-slate-400 block mb-2">Qual fração representa a mesma fatia?</span>
                <span className="text-3xl font-black text-amber-300">?</span>
              </div>
            </div>
          )}

          {currentQ.visualType === 'percentage_card' && (
            <div className="inline-flex flex-col items-center p-6 rounded-3xl bg-gradient-to-br from-indigo-900/60 to-brand-900/60 border border-indigo-500/40 shadow-xl">
              <Percent className="w-12 h-12 text-amber-400 mb-2" />
              <span className="text-sm text-slate-300 font-semibold">Transformação Decimal & Porcentagem</span>
            </div>
          )}
        </div>
      </div>

      {/* Dicas Progressivas (Mecânica 1) */}
      <div className="p-4 rounded-3xl bg-slate-800/60 border border-slate-700/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span>Dicas Didáticas Progressivas ({revealedHints}/3)</span>
          </div>

          {revealedHints < 3 && !isAnswered && (
            <button
              onClick={handleRevealHint}
              className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 transition"
            >
              Liberar Dica {revealedHints + 1}
            </button>
          )}
        </div>

        {revealedHints === 0 ? (
          <p className="text-xs text-slate-400 italic">
            Analise a quantidade total de partes e as partes destacadas. Se precisar de apoio, libere uma dica!
          </p>
        ) : (
          <div className="space-y-2">
            {currentQ.hints.slice(0, revealedHints).map((hint, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/20 text-xs font-semibold text-amber-200 animate-fade-in"
              >
                {hint}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Opções de Resposta */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
          Escolha a resposta correta:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt;
            let btnStyle = 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700';

            if (isAnswered) {
              if (String(opt).trim() === String(currentQ.solution).trim()) {
                btnStyle = 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/30';
              } else if (isSelected) {
                btnStyle = 'bg-rose-600 border-rose-400 text-white';
              } else {
                btnStyle = 'bg-slate-800/40 text-slate-500 border-slate-800';
              }
            }

            return (
              <button
                key={opt}
                disabled={isAnswered}
                onClick={() => handleSelectOption(opt)}
                className={`p-4 rounded-2xl text-xl font-black border-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 ${btnStyle}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Didático Pós-Erro Imediato (Mecânica 3) */}
      {isAnswered && (
        <div className={`p-6 rounded-3xl border-2 animate-fade-in ${
          isCorrect ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-rose-950/40 border-rose-500/50'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <div>
                  <h4 className="text-lg font-black text-emerald-300">Muito Bem! Resposta Exata!</h4>
                  <p className="text-xs text-slate-300">Você dominou a representação visual da fração.</p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8 text-rose-400" />
                <div>
                  <h4 className="text-lg font-black text-rose-300">Ops, resposta incorreta!</h4>
                  <p className="text-xs text-slate-300">Aprenda com a explicação visual didática abaixo:</p>
                </div>
              </>
            )}
          </div>

          {/* Explicação Didática */}
          {(!isCorrect || showExplanation) && currentQ.explanation && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                <BookOpen className="w-4 h-4" />
                <span>{currentQ.explanation.title}</span>
              </div>
              {currentQ.explanation.steps.map((step, idx) => (
                <p key={idx} className="text-xs text-slate-200 font-mono pl-2 border-l-2 border-amber-500">
                  {step}
                </p>
              ))}
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleNext}
              className="btn-game-accent flex items-center gap-2 text-sm"
            >
              <span>{currentIndex + 1 < questions.length ? 'Próximo Desafio' : 'Ver Resultado da Partida'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
