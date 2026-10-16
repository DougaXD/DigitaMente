import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { 
  Lock,
  MousePointerClick
} from 'lucide-react';
import { Settings, StudyText } from '../../types';
import { GhostError } from '../../hooks/useTypingEngine';
import { useCapsLock } from '../../hooks/useCapsLock';
import { t, ui } from '../../i18n';

interface TypingAreaProps {
  targetText: string;
  userInput: string;
  settings: Settings;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  shakeError: boolean;
  ghostErrors?: GhostError[];
  onRemoveGhostError?: (id: number) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onInput: (e: React.FormEvent<HTMLTextAreaElement>) => void;
  onCompositionStart: () => void;
  onCompositionEnd: (e: React.CompositionEvent<HTMLTextAreaElement>) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onRestart?: () => void;
  onNewText?: () => void;
  activeStudyText?: StudyText | null;
}

interface MeasuredChar {
  char: string;
  globalIndex: number;
  width: number;
}

interface MeasuredWord {
  wordIndex: number;
  chars: MeasuredChar[];
  width: number;
}

interface ExplicitLine {
  lineIndex: number;
  words: MeasuredWord[];
  width: number;
}

// Canvas compartilhado para medição precisa de texto
let sharedCanvas: HTMLCanvasElement | null = null;
let sharedCtx: CanvasRenderingContext2D | null = null;

function getSharedCanvasContext(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null;
  if (!sharedCanvas) {
    sharedCanvas = document.createElement('canvas');
    sharedCtx = sharedCanvas.getContext('2d');
  }
  return sharedCtx;
}

const ACCENT_COLOR_MAP: Record<string, { light: string; dark: string; caret: string; bg: string }> = {
  blue: { light: 'rgba(59, 130, 246, 0.4)', dark: 'rgba(96, 165, 250, 0.4)', caret: 'border-blue-600 dark:border-blue-400', bg: 'bg-blue-600 dark:bg-blue-400' },
  emerald: { light: 'rgba(16, 185, 129, 0.4)', dark: 'rgba(52, 211, 153, 0.4)', caret: 'border-emerald-600 dark:border-emerald-400', bg: 'bg-emerald-600 dark:bg-emerald-400' },
  violet: { light: 'rgba(139, 92, 246, 0.4)', dark: 'rgba(167, 139, 250, 0.4)', caret: 'border-violet-600 dark:border-violet-400', bg: 'bg-violet-600 dark:bg-violet-400' },
  amber: { light: 'rgba(245, 158, 11, 0.4)', dark: 'rgba(251, 191, 36, 0.4)', caret: 'border-amber-600 dark:border-amber-400', bg: 'bg-amber-600 dark:bg-amber-400' },
  rose: { light: 'rgba(244, 63, 94, 0.4)', dark: 'rgba(251, 113, 133, 0.4)', caret: 'border-rose-600 dark:border-rose-400', bg: 'bg-rose-600 dark:bg-rose-400' },
  slate: { light: 'rgba(100, 116, 139, 0.4)', dark: 'rgba(148, 163, 184, 0.4)', caret: 'border-slate-600 dark:border-slate-400', bg: 'bg-slate-600 dark:bg-slate-400' },
};

export const TypingArea: React.FC<TypingAreaProps> = ({
  targetText,
  userInput,
  settings,
  isFocused,
  onFocus,
  onBlur,
  shakeError,
  ghostErrors = [],
  onRemoveGhostError = () => {},
  textareaRef,
  onKeyDown,
  onInput,
  onCompositionStart,
  onCompositionEnd,
  onPaste,
  onDrop,
}) => {
  const capsLockOn = useCapsLock();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textViewportRef = useRef<HTMLDivElement | null>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Largura disponível medida no contêiner
  const [containerWidth, setContainerWidth] = useState<number>(896);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  // Coordenadas do cursor (caret)
  const [caretPos, setCaretPos] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  // Deslocamento vertical para manter a linha atual no topo
  const [scrollOffsetY, setScrollOffsetY] = useState<number>(0);

  // Aguarda carregamento das fontes
  useEffect(() => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      setFontsLoaded(true);
    }
  }, []);

  // Monitora redimensionamento do contêiner com debounce
  useEffect(() => {
    if (!textViewportRef.current) return;

    let debounceTimer: any = null;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            setContainerWidth(width);
          }, 60);
        }
      }
    });

    observer.observe(textViewportRef.current);
    return () => {
      observer.disconnect();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, []);

  // Classe e família de fontes
  const { fontClass, fontFamilyString } = useMemo(() => {
    switch (settings.fontFamily) {
      case 'mono':
        return { fontClass: 'font-mono', fontFamilyString: '"Fira Code", monospace, ui-monospace' };
      case 'serif':
        return { fontClass: 'font-serif', fontFamilyString: 'Lora, Georgia, serif' };
      default:
        return { fontClass: 'font-sans', fontFamilyString: 'Inter, system-ui, -apple-system, sans-serif' };
    }
  }, [settings.fontFamily]);

  const effectiveLineHeight = settings.lineHeight ? Math.max(settings.lineHeight, 2.0) : 2.0;
  const lineHeightPx = Math.round(settings.fontSize * effectiveLineHeight);
  const PADDING_VERTICAL_PX = 24;
  const viewportHeightPx = lineHeightPx * settings.visibleLines;
  const boxHeightPx = viewportHeightPx + 2 * PADDING_VERTICAL_PX;

  // CONGELAMENTO DO LAYOUT (Seção B):
  // 1. Calcula as linhas UMA ÚNICA VEZ por texto/dimensões usando canvas measureText.
  // 2. NUNCA recalcula por tecla digitada (userInput NÃO está nas dependências).
  const explicitLines: ExplicitLine[] = useMemo(() => {
    if (!targetText) return [];

    const ctx = getSharedCanvasContext();
    if (ctx) {
      ctx.font = `normal 400 ${settings.fontSize}px ${fontFamilyString}`;
    }

    const measuredWords: MeasuredWord[] = [];
    let currentCharList: MeasuredChar[] = [];
    let wordIdx = 0;

    for (let i = 0; i < targetText.length; i++) {
      const ch = targetText[i];
      let width = 10;
      if (ctx) {
        width = ctx.measureText(ch).width;
      }
      if (settings.letterSpacing) {
        width += settings.letterSpacing;
      }
      // Largura precisa arredondada a centésimos
      width = Math.max(3, Math.round(width * 100) / 100);

      currentCharList.push({ char: ch, globalIndex: i, width });

      if (ch === ' ' || i === targetText.length - 1) {
        const totalWordWidth = currentCharList.reduce((acc, c) => acc + c.width, 0);
        measuredWords.push({
          wordIndex: wordIdx++,
          chars: [...currentCharList],
          width: Math.round(totalWordWidth * 100) / 100,
        });
        currentCharList = [];
      }
    }

    // Distribuição gulosa (greedy) das palavras nas linhas
    const availableWidth = Math.max(160, containerWidth - 4);
    const lines: ExplicitLine[] = [];
    let currentLineWords: MeasuredWord[] = [];
    let currentLineWidth = 0;

    for (const word of measuredWords) {
      if (currentLineWords.length > 0 && currentLineWidth + word.width > availableWidth) {
        lines.push({
          lineIndex: lines.length,
          words: currentLineWords,
          width: currentLineWidth,
        });
        currentLineWords = [word];
        currentLineWidth = word.width;
      } else {
        currentLineWords.push(word);
        currentLineWidth += word.width;
      }
    }

    if (currentLineWords.length > 0) {
      lines.push({
        lineIndex: lines.length,
        words: currentLineWords,
        width: currentLineWidth,
      });
    }

    return lines;
  }, [
    targetText,
    containerWidth,
    settings.fontFamily,
    settings.fontSize,
    settings.letterSpacing,
    fontFamilyString,
    fontsLoaded,
  ]);

  // Atualiza posição do cursor e rolagem suave da linha atual
  const updateCaretAndScroll = useCallback(() => {
    const currentIndex = userInput.length;
    const targetEl = charRefs.current[currentIndex] || charRefs.current[currentIndex - 1];

    // Medição das métricas reais da fonte via canvas
    const ctx = getSharedCanvasContext();
    let fontAscent = settings.fontSize * 0.8;
    let fontDescent = settings.fontSize * 0.22;
    if (ctx) {
      ctx.font = `normal 400 ${settings.fontSize}px ${fontFamilyString}`;
      const tm = ctx.measureText('Mgyjpq');
      if (typeof tm.fontBoundingBoxAscent === 'number') {
        fontAscent = tm.fontBoundingBoxAscent;
      } else if (typeof tm.actualBoundingBoxAscent === 'number') {
        fontAscent = tm.actualBoundingBoxAscent;
      }
      if (typeof tm.fontBoundingBoxDescent === 'number') {
        fontDescent = tm.fontBoundingBoxDescent;
      } else if (typeof tm.actualBoundingBoxDescent === 'number') {
        fontDescent = tm.actualBoundingBoxDescent;
      }
    }

    if (!targetEl) {
      const firstEl = charRefs.current[0];
      if (firstEl) {
        const firstLeft = firstEl.offsetLeft;
        const firstTop = firstEl.offsetTop;
        const firstWidth = firstEl.offsetWidth || 14;
        const baseline = firstTop + Math.round((lineHeightPx + fontAscent - fontDescent) / 2);

        let cWidth = firstWidth;
        let cHeight = lineHeightPx;
        let cLeft = firstLeft;
        let cTop = firstTop;

        if (settings.caretStyle === 'underline') {
          cWidth = Math.round(settings.fontSize * 0.6);
          cHeight = 3;
          cLeft = firstLeft + Math.round((firstWidth - cWidth) / 2);
          cTop = baseline + Math.round(fontDescent) + 6;
        } else if (settings.caretStyle === 'line') {
          cWidth = 2;
          cHeight = Math.round(settings.fontSize * 1.1);
          cTop = firstTop + Math.round((lineHeightPx - cHeight) / 2);
        }

        setCaretPos({
          left: cLeft,
          top: cTop,
          width: cWidth,
          height: cHeight,
        });
        setScrollOffsetY(0);
      }
      return;
    }

    const isPastEnd = currentIndex >= targetText.length;
    const currentSpan = charRefs.current[currentIndex] || targetEl;
    const left = isPastEnd 
      ? (currentSpan.offsetLeft + currentSpan.offsetWidth) 
      : currentSpan.offsetLeft;
    const top = currentSpan.offsetTop;
    const width = isPastEnd ? 12 : (currentSpan.offsetWidth || 14);

    // Linha de base da fonte dentro da linha com altura lineHeightPx
    const baseline = top + Math.round((lineHeightPx + fontAscent - fontDescent) / 2);

    let height = lineHeightPx;
    let computedTop = top;
    let computedLeft = left;
    let computedWidth = width;

    // Ajuste fino de altura e posição vertical por estilo de cursor
    if (settings.caretStyle === 'underline') {
      // Largura FIXA de 0.6em (cerca de 17px com fonte 28px), espessura 3px, centralizado na célula do caractere atual
      const fixedWidth = Math.round(settings.fontSize * 0.6);
      computedWidth = fixedWidth;
      height = 3;
      computedLeft = isPastEnd ? left : left + Math.round((width - fixedWidth) / 2);
      // Topo do cursor = linha de base + descida da fonte (fontBoundingBoxDescent) + 6px
      computedTop = baseline + Math.round(fontDescent) + 6;
    } else if (settings.caretStyle === 'line') {
      computedWidth = 2;
      height = Math.round(settings.fontSize * 1.1);
      computedTop = top + Math.round((lineHeightPx - height) / 2);
    } else {
      // block
      computedWidth = width;
      height = lineHeightPx;
      computedTop = top;
    }

    setCaretPos({ left: computedLeft, top: computedTop, width: computedWidth, height });

    // Mantém a linha atual sempre no topo do viewport
    const firstCharEl = charRefs.current[0];
    const baseTop = firstCharEl ? firstCharEl.offsetTop : 0;
    const currentLineDelta = Math.max(0, top - baseTop);

    setScrollOffsetY(currentLineDelta);
  }, [userInput.length, targetText.length, lineHeightPx, settings.caretStyle, settings.fontSize, fontFamilyString]);

  useEffect(() => {
    updateCaretAndScroll();
  }, [userInput.length, explicitLines, updateCaretAndScroll]);

  // Estilo do cursor
  const getCaretClass = () => {
    // z-10 fica abaixo da camada de letras fantasma (z-20)
    const base = 'absolute pointer-events-none z-10 top-0 left-0';
    // Mantenha a transição suave de posição (transform), mas NÃO anime a largura
    const smooth = settings.caretSmoothness ? 'transition-[transform] duration-100 ease-out' : '';
    const accentBorder = ACCENT_COLOR_MAP[settings.accentColor || 'blue']?.caret || 'border-blue-600 dark:border-blue-400';
    const accentBg = ACCENT_COLOR_MAP[settings.accentColor || 'blue']?.bg || 'bg-blue-600 dark:bg-blue-400';

    switch (settings.caretStyle) {
      case 'underline':
        return `${base} ${smooth} ${accentBg} rounded-full`;
      case 'block':
        return `${base} ${smooth} bg-blue-500/25 dark:bg-blue-400/25 rounded-xs animate-pulse`;
      case 'line':
      default:
        return `${base} ${smooth} border-l-2 ${accentBorder}`;
    }
  };

  // Mapa de posições cobertas por letras fantasma ativas (regra geral: nunca duas letras sobrepostas)
  const activeGhostsByPos = useMemo(() => {
    const map = new Map<number, GhostError>();
    (ghostErrors ?? []).forEach((g) => {
      map.set(g.position, g);
    });
    return map;
  }, [ghostErrors]);

  return (
    <div className="w-full max-w-[960px] mx-auto relative select-none py-2">
      
      {/* Caixa do Teste Principal (Seção C: Dimensões fixas, relevo saltado em toda a superfície) */}
      <div
        ref={containerRef}
        onClick={onFocus}
        className={`relative w-full rounded-[16px] cursor-text overflow-hidden py-6 px-4 sm:px-8 typing-surface ${
          isFocused ? 'is-focused' : ''
        } ${
          shakeError && settings.errorShake ? 'animate-shake' : ''
        }`}
        style={{
          height: `${boxHeightPx}px`,
          minHeight: `${boxHeightPx}px`,
          maxHeight: `${boxHeightPx}px`,
        }}
      >

        {/* Textarea Oculto Sempre Focado */}
        <textarea
          ref={textareaRef}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onInput={onInput}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          onPaste={onPaste}
          onDrop={onDrop}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="absolute -top-[9999px] -left-[9999px] opacity-0 w-1 h-1"
          aria-label={ui.typing_area_entrada_de_digitacao}
        />

        {/* Aviso de Caps Lock Ativado (Posicionado de forma absoluta por cima, sem empurrar a caixa) */}
        {settings.capsLockWarning && capsLockOn && (
          <div 
            aria-live="polite"
            className="absolute top-3 right-4 z-30 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 flex items-center gap-2 text-xs font-medium animate-in fade-in duration-150 shadow-xs pointer-events-none"
          >
            <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{t.typingArea.capsLockOn}</span>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-500/20 px-1 py-0.5 rounded">
              CAPS
            </span>
          </div>
        )}

        {/* Overlay de Desfoque ao perder o foco (Posicionado de forma absoluta, sem empurrar a caixa) */}
        {!isFocused && (
          <div 
            onClick={onFocus}
            className="absolute inset-0 z-30 backdrop-blur-[2px] bg-slate-900/10 dark:bg-slate-950/40 rounded-[16px] flex flex-col items-center justify-center cursor-pointer transition-opacity"
          >
            <div className="bg-white/95 dark:bg-slate-800/95 border border-slate-200/80 dark:border-slate-700 shadow-lg rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-100">
              <MousePointerClick className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t.typingArea.clickToFocus}</span>
            </div>
          </div>
        )}

        {/* Viewport com Rolagem de Linhas */}
        <div
          ref={textViewportRef}
          className="relative w-full overflow-hidden"
          style={{
            height: `${viewportHeightPx}px`,
          }}
        >
          {/* Bloco de linhas que sobe suavemente mantendo a linha atual no topo */}
          <div
            className="relative w-full transition-transform duration-200 ease-out will-change-transform"
            style={{
              transform: `translateY(-${scrollOffsetY}px)`,
              fontSize: `${settings.fontSize}px`,
              letterSpacing: `${settings.letterSpacing}px`,
              lineHeight: `${lineHeightPx}px`,
              fontVariantLigatures: 'none',
              fontKerning: 'none',
              fontFeatureSettings: '"liga" 0, "calt" 0',
              textAlign: 'left',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              hyphens: 'none',
            }}
          >
            {/* Cursor Deslizante (Caret) */}
            {isFocused && caretPos && (
              <div
                className={getCaretClass()}
                style={{
                  transform: `translate3d(${caretPos.left}px, ${caretPos.top}px, 0)`,
                  width: `${caretPos.width}px`,
                  height: `${caretPos.height}px`,
                }}
              />
            )}

            {/* CAMADA FLUTUANTE DE LETRAS FANTASMA (Feedback de Erro Seção B.3) */}
            <div className="absolute inset-0 pointer-events-none z-20">
              {(ghostErrors ?? []).map((ghost) => {
                const targetSpan = charRefs.current[ghost.position];
                if (!targetSpan) return null;

                const left = targetSpan.offsetLeft;
                const top = targetSpan.offsetTop;
                const width = targetSpan.offsetWidth || 14;

                let animationClass = 'animate-ghost-jump';
                if (settings.reduceMotion) {
                  animationClass = 'animate-ghost-flash';
                } else if (ghost.mode === 'replace') {
                  animationClass = 'animate-ghost-replace';
                } else if (ghost.mode === 'above') {
                  animationClass = 'animate-ghost-above';
                }

                return (
                  <span
                    key={ghost.id}
                    onAnimationEnd={() => onRemoveGhostError?.(ghost.id)}
                    className={`absolute text-rose-600 dark:text-rose-500 font-bold select-none text-center ${animationClass}`}
                    style={{
                      left: `${left}px`,
                      top: `${top}px`,
                      width: `${width}px`,
                      lineHeight: `${lineHeightPx}px`,
                    }}
                  >
                    {ghost.char}
                  </span>
                );
              })}
            </div>

            {/* FILEIRAS EXPLÍCITAS (Seção B.2): O navegador NÃO decide as quebras de linha */}
            <div className={`${fontClass} select-none flex flex-col text-left items-start`}>
              {explicitLines.map((line) => (
                <div 
                  key={line.lineIndex}
                  className="flex flex-nowrap whitespace-nowrap text-left items-start w-full"
                  style={{
                    height: `${lineHeightPx}px`,
                    lineHeight: `${lineHeightPx}px`,
                  }}
                >
                  {line.words.map((word) => (
                    <div 
                      key={word.wordIndex}
                      className="inline-flex flex-nowrap whitespace-nowrap shrink-0"
                    >
                      {word.chars.map((mc) => {
                        const isTyped = mc.globalIndex < userInput.length;
                        const typedChar = isTyped ? userInput[mc.globalIndex] : null;
                        const isCorrect = isTyped && typedChar === mc.char;
                        const isError = isTyped && !isCorrect;

                        // Cores de estado
                        let charColor = 'text-slate-400/80 dark:text-slate-500/80';
                        let charBg = 'bg-transparent';
                        let textDecoration = '';
                        let errorInlineStyle: React.CSSProperties = {};

                        if (isCorrect) {
                          charColor = 'text-emerald-600 dark:text-emerald-400';
                        } else if (isError) {
                          charColor = 'text-rose-600 dark:text-rose-400';
                          charBg = 'bg-rose-500/15 dark:bg-rose-500/20';
                          errorInlineStyle = {
                            transition: 'none',
                          };
                          if (settings.colorblindMode) {
                            textDecoration = 'underline decoration-wavy decoration-rose-500';
                          }
                        }

                        // Regra geral de sobreposição: se há uma letra fantasma ativa nesta posição,
                        // ocultar o glifo da letra esperada com opacity: 0 para nunca haver duas letras sobrepostas legíveis.
                        const activeGhost = activeGhostsByPos.get(mc.globalIndex);
                        let glyphClass = '';
                        let glyphStyle: React.CSSProperties = {};

                        if (activeGhost) {
                          if (activeGhost.mode === 'replace') {
                            glyphClass = 'animate-expected-reveal-replace';
                          } else if (activeGhost.mode === 'jump') {
                            glyphClass = 'animate-expected-reveal-jump';
                          } else if (activeGhost.mode === 'above') {
                            // Letra pequena acima: mantém o glifo visível
                          } else if (activeGhost.mode === 'off') {
                            glyphStyle = {};
                          }
                        }

                        // Célula de largura fixa (Seção B.3):
                        // O caractere desenhado é SEMPRE o esperado (mc.char), nunca '␣' nem substituto.
                        return (
                          <span
                            key={mc.globalIndex}
                            ref={(el) => {
                              charRefs.current[mc.globalIndex] = el;
                            }}
                            className={`inline-block relative ${charColor} ${charBg} ${textDecoration} ${glyphClass}`}
                            style={{
                              width: `${mc.width}px`,
                              whiteSpace: mc.char === ' ' ? 'pre' : 'nowrap',
                              textAlign: 'center',
                              fontWeight: 'normal',
                              padding: 0,
                              margin: 0,
                              border: 'none',
                              ...errorInlineStyle,
                              ...glyphStyle,
                            }}
                          >
                            {mc.char}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
