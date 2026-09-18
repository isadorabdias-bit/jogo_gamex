import React, { useState, useRef, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { sound } from '../utils/audio';
import {
  Accessibility,
  X,
  Sun,
  ZoomIn,
  ZoomOut,
  BookOpen,
  Wind,
  Underline,
  MousePointer2,
  AlignJustify,
  RotateCcw,
  Check,
  Volume2
} from 'lucide-react';

/**
 * Componente de anúncio para leitores de tela (ARIA Live Region)
 */
export function ScreenReaderAnnouncer({ message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

/**
 * Barra flutuante de acessibilidade
 */
export default function AccessibilityBar() {
  const { prefs, update, reset } = useAccessibility();
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  // Fecha o painel ao clicar fora
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target) &&
          !triggerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Fechar com Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  function announce(msg) {
    setAnnouncement('');
    requestAnimationFrame(() => setAnnouncement(msg));
  }

  function toggle(key, label) {
    sound.playClick();
    const newVal = !prefs[key];
    update(key, newVal);
    announce(`${label}: ${newVal ? 'ativado' : 'desativado'}`);
  }

  function setFontSize(size) {
    sound.playClick();
    update('fontSize', size);
    const labels = { small: 'Pequeno', normal: 'Normal', large: 'Grande', xlarge: 'Extra Grande' };
    announce(`Tamanho de texto: ${labels[size]}`);
  }

  function setLineSpacing(spacing) {
    sound.playClick();
    update('lineSpacing', spacing);
    const labels = { normal: 'Normal', relaxed: 'Espaçado', loose: 'Extra Espaçado' };
    announce(`Espaçamento entre linhas: ${labels[spacing]}`);
  }

  function handleReset() {
    sound.playClick();
    reset();
    announce('Configurações de acessibilidade redefinidas para o padrão.');
  }

  const fontSizeOptions = [
    { id: 'small', label: 'A', title: 'Texto Pequeno (14px)', size: 'text-xs' },
    { id: 'normal', label: 'A', title: 'Texto Normal (16px)', size: 'text-sm' },
    { id: 'large', label: 'A', title: 'Texto Grande (19px)', size: 'text-base' },
    { id: 'xlarge', label: 'A', title: 'Texto Extra Grande (22px)', size: 'text-xl' },
  ];

  const spacingOptions = [
    { id: 'normal', label: 'Normal' },
    { id: 'relaxed', label: 'Espaçado' },
    { id: 'loose', label: 'Largo' },
  ];

  const toggleOptions = [
    {
      key: 'highContrast',
      label: 'Alto Contraste',
      desc: 'Fundo claro com texto escuro de alto contraste para baixa visão',
      icon: Sun,
      color: 'text-yellow-400'
    },
    {
      key: 'dyslexiaFont',
      label: 'Fonte para Dislexia',
      desc: 'Usa a fonte OpenDyslexic especialmente desenvolvida para leitores com dislexia',
      icon: BookOpen,
      color: 'text-emerald-400'
    },
    {
      key: 'reducedMotion',
      label: 'Reduzir Animações',
      desc: 'Remove transições e efeitos de movimento para usuários sensíveis',
      icon: Wind,
      color: 'text-cyan-400'
    },
    {
      key: 'underlineLinks',
      label: 'Sublinhar Links',
      desc: 'Sublinha todos os links e botões para facilitar a identificação visual',
      icon: Underline,
      color: 'text-brand-400'
    },
    {
      key: 'cursorLarge',
      label: 'Cursor Ampliado',
      desc: 'Aumenta o tamanho do cursor do mouse para facilitar a localização',
      icon: MousePointer2,
      color: 'text-amber-400'
    },
    {
      key: 'screenReaderMode',
      label: 'Modo Leitor de Tela',
      desc: 'Ativa anúncios de progresso e resultados via ARIA live regions',
      icon: Volume2,
      color: 'text-pink-400'
    },
  ];

  // Conta quantas preferências estão ativas (não padrão)
  const activeCount = [
    prefs.highContrast,
    prefs.dyslexiaFont,
    prefs.reducedMotion,
    prefs.underlineLinks,
    prefs.cursorLarge,
    prefs.screenReaderMode,
    prefs.fontSize !== 'normal',
    prefs.lineSpacing !== 'normal',
  ].filter(Boolean).length;

  return (
    <>
      {/* ARIA Live Region */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Botão flutuante de acessibilidade */}
      <div className="fixed bottom-6 right-6 z-50">

        {/* Painel de Configurações de Acessibilidade */}
        {open && (
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Painel de Acessibilidade"
            aria-modal="true"
            className={`absolute bottom-16 right-0 w-80 rounded-3xl shadow-2xl border-2 overflow-hidden
              ${prefs.highContrast
                ? 'bg-white border-black text-black'
                : 'bg-slate-900 border-slate-600 text-white'
              }`}
          >
            {/* Cabeçalho do Painel */}
            <div className={`flex items-center justify-between px-5 py-4 border-b ${prefs.highContrast ? 'border-black bg-gray-100' : 'border-slate-700 bg-slate-800'}`}>
              <div className="flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-brand-400" aria-hidden="true" />
                <h2 className="font-black text-sm">Acessibilidade</h2>
                {activeCount > 0 && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-brand-600 text-white">
                    {activeCount} ativo{activeCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar painel de acessibilidade"
                className={`p-1.5 rounded-xl transition ${prefs.highContrast ? 'hover:bg-gray-200' : 'hover:bg-slate-700'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-5 max-h-[70vh] overflow-y-auto">

              {/* Tamanho do Texto */}
              <fieldset>
                <legend className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
                  Tamanho do Texto
                </legend>
                <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Tamanho do texto">
                  {fontSizeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      role="radio"
                      aria-checked={prefs.fontSize === opt.id}
                      aria-label={opt.title}
                      title={opt.title}
                      onClick={() => setFontSize(opt.id)}
                      className={`py-2 rounded-xl font-black border-2 transition ${opt.size} ${
                        prefs.fontSize === opt.id
                          ? 'border-brand-400 bg-brand-500/20 text-brand-300'
                          : prefs.highContrast
                          ? 'border-gray-400 bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Espaçamento entre linhas */}
              <fieldset>
                <legend className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <AlignJustify className="w-3.5 h-3.5" aria-hidden="true" />
                  Espaçamento entre Linhas
                </legend>
                <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Espaçamento entre linhas">
                  {spacingOptions.map((opt) => (
                    <button
                      key={opt.id}
                      role="radio"
                      aria-checked={prefs.lineSpacing === opt.id}
                      onClick={() => setLineSpacing(opt.id)}
                      className={`py-2 px-2 rounded-xl font-bold text-xs border-2 transition ${
                        prefs.lineSpacing === opt.id
                          ? 'border-brand-400 bg-brand-500/20 text-brand-300'
                          : prefs.highContrast
                          ? 'border-gray-400 bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Toggles de Acessibilidade */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Opções Visuais e Cognitivas
                </span>
                {toggleOptions.map(({ key, label, desc, icon: Icon, color }) => {
                  const isOn = prefs[key];
                  return (
                    <button
                      key={key}
                      role="switch"
                      aria-checked={isOn}
                      aria-label={`${label}: ${isOn ? 'ativado' : 'desativado'}`}
                      onClick={() => toggle(key, label)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition text-left ${
                        isOn
                          ? 'border-brand-400/60 bg-brand-500/10'
                          : prefs.highContrast
                          ? 'border-gray-400 bg-gray-50 hover:bg-gray-100'
                          : 'border-slate-700/60 bg-slate-800/60 hover:bg-slate-700/60'
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isOn ? color : 'text-slate-500'}`} aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <span className={`font-bold text-xs block ${isOn ? 'text-white' : 'text-slate-300'}`}>
                          {label}
                        </span>
                        <span className="text-[10px] text-slate-400 leading-snug block">
                          {desc}
                        </span>
                      </div>
                      {/* Toggle visual */}
                      <div
                        className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 relative ${
                          isOn ? 'bg-brand-500' : prefs.highContrast ? 'bg-gray-300' : 'bg-slate-600'
                        }`}
                        aria-hidden="true"
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isOn ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Botão Redefinir */}
              <button
                onClick={handleReset}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border text-xs font-bold transition ${
                  prefs.highContrast
                    ? 'border-gray-400 text-gray-700 hover:bg-gray-100'
                    : 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                Redefinir para o Padrão
              </button>

              {/* Nota de Rodapé */}
              <p className="text-[10px] text-slate-500 text-center leading-relaxed pt-1 border-t border-slate-800">
                As preferências são salvas automaticamente no seu dispositivo e persistem entre sessões.
              </p>

            </div>
          </div>
        )}

        {/* Botão Flutuante Principal */}
        <button
          ref={triggerRef}
          onClick={() => {
            sound.playClick();
            setOpen(prev => !prev);
          }}
          aria-label={`Acessibilidade${activeCount > 0 ? ` (${activeCount} recurso${activeCount > 1 ? 's' : ''} ativo${activeCount > 1 ? 's' : ''})` : ''}`}
          aria-expanded={open}
          aria-haspopup="dialog"
          className={`relative w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-brand-400/60 ${
            open
              ? 'bg-brand-600 shadow-brand-600/40'
              : 'bg-slate-800 border border-slate-600 hover:bg-slate-700 shadow-slate-900/60'
          }`}
        >
          <Accessibility className="w-7 h-7 text-white" aria-hidden="true" />
          {activeCount > 0 && !open && (
            <span
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-500 border-2 border-slate-900 text-white text-[10px] font-black flex items-center justify-center"
              aria-hidden="true"
            >
              {activeCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
