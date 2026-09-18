import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext(null);

const DEFAULTS = {
  fontSize: 'normal',      // 'small' | 'normal' | 'large' | 'xlarge'
  highContrast: false,     // fundo branco + texto preto com bordas claras
  dyslexiaFont: false,     // OpenDyslexic
  reducedMotion: false,    // desativa animações e transições
  underlineLinks: false,   // sublinha todos os links
  screenReaderMode: false, // habilita anúncios ARIA live
  cursorLarge: false,      // cursor maior
  lineSpacing: 'normal',   // 'normal' | 'relaxed' | 'loose'
};

export function AccessibilityProvider({ children }) {
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('mathplay_a11y');
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  // Persiste preferências a cada mudança
  useEffect(() => {
    localStorage.setItem('mathplay_a11y', JSON.stringify(prefs));
    applyPrefs(prefs);
  }, [prefs]);

  // Respeita preferência do sistema para movimento reduzido
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setPrefs(prev => ({ ...prev, reducedMotion: true }));
    }
  }, []);

  function applyPrefs(p) {
    const root = document.documentElement;

    // Tamanho de fonte base
    const fontSizeMap = { small: '14px', normal: '16px', large: '19px', xlarge: '22px' };
    root.style.setProperty('--a11y-font-size', fontSizeMap[p.fontSize] || '16px');

    // Classes no <html> para CSS global
    root.classList.toggle('a11y-high-contrast', p.highContrast);
    root.classList.toggle('a11y-dyslexia', p.dyslexiaFont);
    root.classList.toggle('a11y-reduced-motion', p.reducedMotion);
    root.classList.toggle('a11y-underline-links', p.underlineLinks);
    root.classList.toggle('a11y-cursor-large', p.cursorLarge);

    const spacingMap = { normal: '1.5', relaxed: '1.8', loose: '2.2' };
    root.style.setProperty('--a11y-line-height', spacingMap[p.lineSpacing] || '1.5');
  }

  const update = (key, value) => setPrefs(prev => ({ ...prev, [key]: value }));
  const reset = () => setPrefs(DEFAULTS);

  return (
    <AccessibilityContext.Provider value={{ prefs, update, reset }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility deve ser usado dentro de AccessibilityProvider');
  return ctx;
}
