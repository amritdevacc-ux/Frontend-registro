import { useEffect, useRef, useState, useCallback, RefObject } from 'react';

const THRESHOLD = 72;   // px da trascinare verso il basso per triggerare il refresh
const MAX_PULL  = 100; // limite visivo del trascinamento

interface Options {
  onRefresh: () => Promise<void>;
  /** Elemento da osservare, default: window */
  containerRef?: RefObject<HTMLElement | null>;
  /** Disabilita il pull (es: durante loading iniziale) */
  disabled?: boolean;
}

export function usePullToRefresh({ onRefresh, containerRef, disabled }: Options) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const pulling = useRef(false);

  const getScrollTop = useCallback(() => {
    if (containerRef?.current) return containerRef.current.scrollTop;
    return window.scrollY;
  }, [containerRef]);

  useEffect(() => {
    if (disabled) return;

    const el = containerRef?.current ?? window;

    const onTouchStart = (e: Event) => {
      const touch = (e as TouchEvent).touches[0];
      // Inizia il pull solo se siamo in cima alla pagina
      if (getScrollTop() === 0) {
        startY.current = touch.clientY;
        pulling.current = true;
      }
    };

    const onTouchMove = (e: Event) => {
      if (!pulling.current || startY.current === null) return;
      const touch = (e as TouchEvent).touches[0];
      const delta = touch.clientY - startY.current;
      if (delta > 0) {
        // Applicare resistenza per effetto naturale
        setPullDistance(Math.min(delta * 0.5, MAX_PULL));
      }
    };

    const onTouchEnd = async () => {
      if (!pulling.current) return;
      pulling.current = false;

      if (pullDistance >= THRESHOLD) {
        setIsRefreshing(true);
        setPullDistance(0);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      } else {
        setPullDistance(0);
      }
      startY.current = null;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove',  onTouchMove,  { passive: true });
    el.addEventListener('touchend',   onTouchEnd,   { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove',  onTouchMove);
      el.removeEventListener('touchend',   onTouchEnd);
    };
  }, [disabled, onRefresh, pullDistance, getScrollTop, containerRef]);

  return { pullDistance, isRefreshing };
}
