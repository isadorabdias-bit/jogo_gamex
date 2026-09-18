import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import BadgeModal from '../components/BadgeModal';
import confetti from 'canvas-confetti';
import { 
  Scale, 
  Lightbulb, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Star, 
  Trophy, 
  Clock, 
  Flame, 
  BookOpen 
} from 'lucide-react';

export default function EquationGame({ stageId = null, initialDifficulty = 'facil', onBackToHub }) {
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

  // Estatísticas da partida
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [gameFinished, setGameFinished] = useState(false);
  const [finishData, setFinishData] = useState(null);
  const [newBadges, setNewBadges] = useState([]);

  // Carrega as questões
  useEffect(() => {
    loadQuestions(difficulty);
  }, [difficulty]);

  const loadQuestions = async (diff) => {
    setLoading(true);
    try {
      const res = await api.getQuestions('equacoes', diff);
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
      console.error('Erro ao carregar questões de equações:', err);
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

    const correct = opt === currentQ.solution;
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      const streakBonus = streak * 20;
      const hintPenalty = revealedHints * 25;
      const roundPoints = Math.max(50, 100 + streakBonus - hintPenalty);

      setScore(prev => prev + roundPoints);
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
    } else {
      sound.playWrong();
      setStreak(0);
      setWrongCount(prev => prev + 1);
      setShowExplanation(true); // Exibe feedback didático imediato
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
    const total = correctCount + (isCorrect ? 0 : 0); // contagem já atualizada

    try {
      const res = await api.saveSession({
        gameType: 'equacoes',
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
      console.error('Erro ao salvar sessão de jogo:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-14 h-14 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-base font-bold text-slate-300">Preparando a Caça ao Tesouro...</p>
      </div>
    );
  }

  if (gameFinished && finishData) {
    const accuracyPercent = Math.round(finishData.accuracy * 100);
    let starsEarned = 1;
    if (accuracyPercent >= 100) starsEarned = 3;
    else if (accuracyPercent >= 70) starsEarned = 2;

    return (
      <div className="max-w-xl mx-auto my-8 p-6 sm:p-8 bg-slate-900 border-2 border-brand-500/40 rounded-3xl shadow-2xl text-center animate-fade-in">
        <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-brand-600 to-amber-400 text-white shadow-xl mb-4">
          <Trophy className="w-14 h-14 text-amber-200" />
        </div>

        <h2 className="text-3xl font-black text-white mb-2">Desafio Concluído!</h2>
        <p className="text-slate-300 text-sm mb-6">
          Caça ao Tesouro • Nível {difficulty.toUpperCase()}
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

        {/* Cards de Métricas */}
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
              PARABÉNS! VOCÊ SUBIU PARA O NÍVEL {finishData.level}!
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

  // Inclinação visual da balança
  let balanceTilt = 'rotate-0';
  if (isAnswered) {
    if (!isCorrect) {
      balanceTilt = selectedOption > currentQ.solution ? 'rotate-6' : '-rotate-6';
    }
  }

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in"
      role="main"
      aria-label="Jogo Balança das Equações"
    >
      {/* Status para leitores de tela */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isAnswered
          ? isCorrect
            ? `Resposta correta! Questão ${currentIndex + 1} de ${questions.length}.`
            : `Resposta incorreta. A resposta certa era x = ${currentQ?.solution}. Questão ${currentIndex + 1} de ${questions.length}.`
          : `Questão ${currentIndex + 1} de ${questions.length}. Equação: ${currentQ?.equation}. Qual é o valor de x?`
        }
      </div>

      {/* Topo de Status do Jogo */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-slate-800/80 border border-slate-700 backdrop-blur-md" role="region" aria-label="Status do jogo">
        
        {/* Seletor de Dificuldade Adaptativa */}
        <div className="flex items-center gap-2" role="group" aria-label="Selecionar dificuldade">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider" aria-hidden="true">Nível:</span>
          {['facil', 'medio', 'dificil'].map((diff) => {
            const label = diff === 'facil' ? 'Fácil' : diff === 'medio' ? 'Médio' : 'Difícil';
            return (
              <button
                key={diff}
                onClick={() => {
                  sound.playClick();
                  setDifficulty(diff);
                }}
                aria-pressed={difficulty === diff}
                aria-label={`Dificuldade ${label}${difficulty === diff ? ' (selecionada)' : ''}`}
                className={`px-3 py-1 rounded-xl text-xs font-black capitalize transition ${
                  difficulty === diff
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {label}
              </button>
            );
          })}
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

      {/* Visual da Balança Algébrica */}
      <div className="card-gaming relative overflow-hidden text-center py-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-black uppercase tracking-wider mb-2">
          <Scale className="w-4 h-4 text-brand-400" />
          Balança de Dois Pratos em Equilíbrio
        </div>

        <h3 className="text-3xl sm:text-4xl font-black text-white tracking-wider my-3">
          {currentQ.equation}
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mb-8">
          Descubra qual o valor numérico da incógnita <span className="text-amber-400 font-bold">x</span> para que a balança continue perfeitamente equilibrada!
        </p>

        {/* Estrutura SVG/CSS da Balança Interativa */}
        <div className="relative max-w-lg mx-auto my-4 py-4">
          
          {/* Barra Transversal com inclinação dinâmica */}
          <div className={`relative w-full h-3.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-full shadow-lg transition-transform duration-500 ease-out ${balanceTilt}`}>
            
            {/* Prato Esquerdo */}
            <div className="absolute left-4 -bottom-2 transform -translate-x-1/2 flex flex-col items-center">
              <div className="w-0.5 h-16 bg-amber-400/70" />
              <div className="min-w-[130px] p-3 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-400 shadow-xl flex flex-wrap items-center justify-center gap-1.5">
                {currentQ.leftItems.map((item, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black shadow ${
                      item.type === 'variable'
                        ? 'bg-brand-600 text-white border border-brand-400'
                        : 'bg-emerald-600 text-white border border-emerald-400'
                    }`}
                  >
                    {item.label}
                  </span>
                ))}
              </div>
              <span className="text-[11px] font-bold text-slate-400 mt-1">Prato Esquerdo</span>
            </div>

            {/* Prato Direito */}
            <div className="absolute right-4 -bottom-2 transform translate-x-1/2 flex flex-col items-center">
              <div className="w-0.5 h-16 bg-amber-400/70" />
              <div className="min-w-[130px] p-3 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-400 shadow-xl flex flex-wrap items-center justify-center gap-1.5">
                {currentQ.rightItems.map((item, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black shadow ${
                      item.type === 'variable'
                        ? 'bg-brand-600 text-white border border-brand-400'
                        : 'bg-amber-600 text-white border border-amber-400'
                    }`}
                  >
                    {item.label}
                  </span>
                ))}
              </div>
              <span className="text-[11px] font-bold text-slate-400 mt-1">Prato Direito</span>
            </div>

            {/* Marcador Central de Nível */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-900 border-2 border-yellow-300 flex items-center justify-center shadow-lg">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            </div>
          </div>

          {/* Pedestal Central */}
          <div className="mx-auto w-4 h-24 bg-gradient-to-b from-slate-700 to-slate-800 mt-1 rounded-t-md" />
          <div className="mx-auto w-24 h-4 bg-slate-700 rounded-full shadow-md" />
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
            Tente resolver sozinho para ganhar a pontuação máxima! Se tiver dúvidas, clique em "Liberar Dica".
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
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center" id="answer-label">
          Qual é o valor de x?
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="group" aria-labelledby="answer-label">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt;
            let btnStyle = 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700';
            let ariaLabel = `Resposta x = ${opt}`;

            if (isAnswered) {
              if (opt === currentQ.solution) {
                btnStyle = 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/30';
                ariaLabel = `x = ${opt} — Resposta correta`;
              } else if (isSelected) {
                btnStyle = 'bg-rose-600 border-rose-400 text-white';
                ariaLabel = `x = ${opt} — Resposta escolhida, incorreta`;
              } else {
                btnStyle = 'bg-slate-800/40 text-slate-500 border-slate-800';
                ariaLabel = `x = ${opt} — Opção incorreta`;
              }
            }

            return (
              <button
                key={opt}
                disabled={isAnswered}
                onClick={() => handleSelectOption(opt)}
                aria-label={ariaLabel}
                aria-pressed={isSelected && isAnswered ? true : undefined}
                className={`p-4 rounded-2xl text-xl font-black border-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 ${btnStyle}`}
              >
                x = {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Pós-Erro Didático Imediato (Mecânica 3) */}
      {isAnswered && (
        <div className={`p-6 rounded-3xl border-2 animate-fade-in ${
          isCorrect ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-rose-950/40 border-rose-500/50'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <div>
                  <h4 className="text-lg font-black text-emerald-300">Resposta Correta!</h4>
                  <p className="text-xs text-slate-300">Você manteve os dois lados da balança perfeitamente iguais.</p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8 text-rose-400" />
                <div>
                  <h4 className="text-lg font-black text-rose-300">Não foi dessa vez! Mas não se preocupe:</h4>
                  <p className="text-xs text-slate-300">Veja abaixo o passo a passo de resolução para aprender:</p>
                </div>
              </>
            )}
          </div>

          {/* Caixa de Explicação Didática */}
          {(!isCorrect || showExplanation) && currentQ.explanation && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                <BookOpen className="w-4 h-4" />
                <span>{currentQ.explanation.title}</span>
              </div>
              {currentQ.explanation.steps.map((step, idx) => (
                <p key={idx} className="text-xs text-slate-200 font-mono pl-2 border-l-2 border-brand-500">
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
              <span>{currentIndex + 1 < questions.length ? 'Próxima Equação' : 'Ver Resultado da Partida'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
