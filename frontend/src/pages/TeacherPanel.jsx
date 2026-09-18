import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import AvatarIcon from '../components/AvatarIcon';
import { sound } from '../utils/audio';
import { 
  GraduationCap, 
  Users, 
  Target, 
  Gamepad2, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Scale, 
  PieChart, 
  Sparkles,
  BookOpen,
  Filter,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronRight,
  ChevronDown,
  X,
  Clock,
  Star,
  Activity,
  Layers
} from 'lucide-react';

export default function TeacherPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);
  const [expandedStudentId, setExpandedStudentId] = useState(null);

  useEffect(() => {
    loadTeacherData();
  }, []);

  const loadTeacherData = async () => {
    try {
      const res = await api.getTeacherOverview();
      setData(res);
    } catch (err) {
      console.error('Erro ao carregar dados do professor:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-300 font-bold text-sm">Carregando painel pedagógico...</p>
      </div>
    );
  }

  const { metrics, students = [], recentActivity = [] } = data || {};

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(filterText.toLowerCase()) ||
    s.email.toLowerCase().includes(filterText.toLowerCase()) ||
    (s.grade && s.grade.toLowerCase().includes(filterText.toLowerCase()))
  );

  const toggleExpand = (studentId) => {
    sound.playClick();
    setExpandedStudentId(prev => (prev === studentId ? null : studentId));
  };

  const openStudentModal = (student) => {
    sound.playClick();
    setSelectedStudentForModal(student);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Cabeçalho do Professor */}
      <div className="card-gaming flex flex-col md:flex-row items-center justify-between gap-6 border-indigo-500/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-black uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            Ambiente de Gestão Pedagógica & Diagnóstico Individual
          </div>
          <h1 className="text-3xl font-black text-white">Painel do Professor • Matemática</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Monitore o nível, conteúdos acessados, facilidades, dificuldades e os tipos de erros recorrentes de cada aluno da turma.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-center">
            <span className="text-xs text-slate-400 block font-bold">Turmas Monitoradas</span>
            <span className="text-lg font-black text-indigo-400">Ensino Fundamental II</span>
          </div>
        </div>
      </div>

      {/* Métricas Gerais da Turma */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-gaming flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Total de Alunos</span>
            <span className="text-2xl font-black text-white">{metrics?.totalStudents || 0}</span>
          </div>
        </div>

        <div className="card-gaming flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Média de Precisão</span>
            <span className="text-2xl font-black text-emerald-400">{metrics?.classAvgAccuracy || 0}%</span>
          </div>
        </div>

        <div className="card-gaming flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Gamepad2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Partidas Jogadas</span>
            <span className="text-2xl font-black text-white">{metrics?.totalClassMatches || 0}</span>
          </div>
        </div>

        <div className="card-gaming flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">Acertos Coletivos</span>
            <span className="text-2xl font-black text-amber-400">{metrics?.classCorrectAnswers || 0}</span>
          </div>
        </div>
      </div>

      {/* Seção de Diagnóstico Individual dos Alunos */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-brand-400" />
              Mapeamento de Habilidades e Erros por Aluno
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Clique em qualquer aluno para inspecionar onde ele tem facilidade, dificuldade e quais erros está cometendo.
            </p>
          </div>

          {/* Campo de Busca */}
          <div className="relative w-full sm:w-72">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar aluno ou turma..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Lista de Cards Diagnósticos de Alunos */}
        <div className="space-y-4">
          {filteredStudents.map((student) => {
            const accPercent = Math.round((student.avg_accuracy || 0) * 100);
            const isExpanded = expandedStudentId === student.id;
            const diag = student.diagnosis;

            return (
              <div
                key={student.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 shadow-lg hover:border-brand-500/50 transition-all duration-200"
              >
                {/* Linha Principal do Aluno */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Identificação */}
                  <div className="flex items-center gap-3.5 min-w-[240px]">
                    <AvatarIcon avatarId={student.avatar} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{student.name}</span>
                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30">
                          {student.grade || '7º Ano'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{student.email}</span>
                    </div>
                  </div>

                  {/* Informações Resumidas: Nível, Jogo que está jogando e Precisão */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    
                    {/* Nível do Aluno */}
                    <div className="p-2.5 bg-slate-900/80 rounded-2xl border border-slate-700/80 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Nível Atual</span>
                      <span className="font-black text-amber-400 text-sm">Nível {student.level}</span>
                      <span className="text-[10px] text-slate-400 block">{student.xp} XP</span>
                    </div>

                    {/* Jogo em Andamento / Praticado */}
                    <div className="p-2.5 bg-slate-900/80 rounded-2xl border border-slate-700/80 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Jogo Recente</span>
                      <span className="font-bold text-cyan-300 truncate block">
                        {diag?.currentGame?.gameName || 'Nenhum'}
                      </span>
                      <span className="text-[10px] text-slate-400 block capitalize">
                        Nível {diag?.currentGame?.difficulty}
                      </span>
                    </div>

                    {/* Taxa de Acerto */}
                    <div className="p-2.5 bg-slate-900/80 rounded-2xl border border-slate-700/80 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Precisão</span>
                      <span className={`font-black text-sm ${
                        accPercent >= 70 ? 'text-emerald-400' : accPercent >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {accPercent}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">{student.total_sessions} partidas</span>
                    </div>

                    {/* Estrelas Coletadas na Trilha */}
                    <div className="p-2.5 bg-slate-900/80 rounded-2xl border border-slate-700/80 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Trilha</span>
                      <span className="font-black text-amber-300 text-sm flex items-center justify-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {student.stars_collected} ★
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {diag?.accessedContent?.highestStageUnlocked} fases abertas
                      </span>
                    </div>

                  </div>

                  {/* Botões de Ação */}
                  <div className="flex items-center gap-2 self-end lg:self-center">
                    <button
                      onClick={() => toggleExpand(student.id)}
                      className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <span>Diagnóstico</span>
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openStudentModal(student)}
                      className="btn-game-primary text-xs py-2 px-3.5"
                    >
                      Ficha Completa
                    </button>
                  </div>

                </div>

                {/* Bloco de Diagnóstico Expandido Inline */}
                {isExpanded && diag && (
                  <div className="mt-5 pt-5 border-t border-slate-700/80 space-y-4 animate-fade-in text-xs">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Onde tem mais facilidade */}
                      <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5">
                        <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-sm">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Onde tem mais Facilidade:</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          {diag.strengths}
                        </p>
                      </div>

                      {/* Onde tem mais dificuldade */}
                      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-1.5">
                        <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span>Onde tem mais Dificuldade:</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          {diag.weaknesses}
                        </p>
                      </div>

                    </div>

                    {/* No que está errando especificamente */}
                    <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-1.5">
                      <div className="flex items-center gap-2 text-rose-300 font-extrabold text-sm">
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>No que está errando especificamente:</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">
                        {diag.commonErrors}
                      </p>
                    </div>

                    {/* O que foi acessado & Recomendação Pedagógica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      
                      {/* Fases e Recursos Acessados */}
                      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
                          <Layers className="w-4 h-4 text-cyan-400" />
                          <span>Fases e Conteúdos Acessados na Trilha:</span>
                        </div>
                        <div className="space-y-1.5">
                          {diag.accessedContent?.stages?.map(st => (
                            <div key={st.stageId} className="flex items-center justify-between text-slate-300 bg-slate-800/60 px-3 py-1.5 rounded-xl">
                              <span className="truncate">{st.name}</span>
                              <span className="font-bold flex items-center gap-1">
                                {st.status === 'completed' ? (
                                  <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> {st.stars} ★
                                  </span>
                                ) : st.status === 'unlocked' ? (
                                  <span className="text-amber-400 text-[11px]">Desbloqueada</span>
                                ) : (
                                  <span className="text-slate-500 text-[11px]">Bloqueada</span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recomendação de Intervenção para o Professor */}
                      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
                            <Lightbulb className="w-4 h-4 text-indigo-400" />
                            <span>Intervenção Pedagógica Sugerida:</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">
                            {diag.teacherRecommendation}
                          </p>
                        </div>
                        <div className="pt-2 text-[11px] text-slate-400 border-t border-indigo-500/20">
                          Último acesso: {student.last_active !== 'Nenhuma partida' ? new Date(student.last_active).toLocaleString('pt-BR') : 'Nunca jogou'}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Ficha Pedagógica Completa do Aluno */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 shadow-2xl space-y-6">
            
            {/* Fechar */}
            <button
              onClick={() => setSelectedStudentForModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabeçalho do Aluno */}
            <div className="flex items-center gap-4">
              <AvatarIcon avatarId={selectedStudentForModal.avatar} size="lg" />
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Ficha Diagnóstica do Aluno
                </span>
                <h3 className="text-2xl font-black text-white mt-1">{selectedStudentForModal.name}</h3>
                <p className="text-xs text-slate-400">{selectedStudentForModal.email} • {selectedStudentForModal.grade || '7º Ano'}</p>
              </div>
            </div>

            {/* Status do Jogo Atual e Nível */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nível do Aluno</span>
                <span className="text-lg font-black text-amber-400">Nível {selectedStudentForModal.level}</span>
                <span className="text-[11px] text-slate-400 block">{selectedStudentForModal.xp} XP Acumulado</span>
              </div>

              <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Jogo que está jogando</span>
                <span className="text-sm font-bold text-cyan-300 block truncate">
                  {selectedStudentForModal.diagnosis?.currentGame?.gameName}
                </span>
                <span className="text-[11px] text-slate-400 block capitalize">
                  Dificuldade: {selectedStudentForModal.diagnosis?.currentGame?.difficulty}
                </span>
              </div>

              <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Precisão Geral</span>
                <span className="text-lg font-black text-emerald-400">
                  {Math.round((selectedStudentForModal.avg_accuracy || 0) * 100)}%
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {selectedStudentForModal.total_sessions} partidas jogadas
                </span>
              </div>
            </div>

            {/* Diagnóstico Pedagógico */}
            <div className="space-y-4">
              
              {/* Onde tem mais facilidade */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40">
                <h4 className="text-sm font-extrabold text-emerald-300 flex items-center gap-2 mb-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Onde tem mais facilidade:
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedStudentForModal.diagnosis?.strengths}
                </p>
              </div>

              {/* Onde tem mais dificuldade */}
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40">
                <h4 className="text-sm font-extrabold text-amber-300 flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Onde tem mais dificuldade:
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedStudentForModal.diagnosis?.weaknesses}
                </p>
              </div>

              {/* No que está errando */}
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40">
                <h4 className="text-sm font-extrabold text-rose-300 flex items-center gap-2 mb-1.5">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  No que está errando especificamente:
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedStudentForModal.diagnosis?.commonErrors}
                </p>
              </div>

              {/* O que foi acessado */}
              <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700">
                <h4 className="text-sm font-extrabold text-cyan-300 flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Módulos e Fases Acessadas:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedStudentForModal.diagnosis?.accessedContent?.stages?.map(st => (
                    <div key={st.stageId} className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-700/60">
                      <span className="text-slate-300 font-semibold truncate">{st.name}</span>
                      <span className="font-bold">
                        {st.status === 'completed' ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {st.stars} ★
                          </span>
                        ) : st.status === 'unlocked' ? (
                          <span className="text-amber-400">Aberta</span>
                        ) : (
                          <span className="text-slate-500">Bloqueada</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recomendação de Intervenção */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/50">
                <h4 className="text-sm font-extrabold text-indigo-300 flex items-center gap-2 mb-1.5">
                  <Lightbulb className="w-4 h-4 text-indigo-400" />
                  Orientação Pedagógica Docente:
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedStudentForModal.diagnosis?.teacherRecommendation}
                </p>
              </div>

            </div>

            <button
              onClick={() => setSelectedStudentForModal(null)}
              className="w-full btn-game-primary text-sm py-3"
            >
              Fechar Ficha do Aluno
            </button>

          </div>
        </div>
      )}

      {/* Histórico Recente de Atividades da Turma */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-indigo-400" />
          Atividades em Tempo Real da Turma
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentActivity.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3"
            >
              <AvatarIcon avatarId={act.student_avatar} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white truncate">{act.student_name}</span>
                  <span className="text-[10px] text-amber-400 font-black">{act.score} pts</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="capitalize">{act.game_type === 'equacoes' ? 'Balança de Equações' : 'Frações'}</span>
                  <span>•</span>
                  <span className="capitalize font-semibold text-slate-300">{act.difficulty}</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  {new Date(act.played_at).toLocaleDateString('pt-BR')} às {new Date(act.played_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
