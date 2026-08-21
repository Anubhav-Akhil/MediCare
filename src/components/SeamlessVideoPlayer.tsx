'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface SeamlessVideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  videoStyle?: React.CSSProperties;
  crossfadeDuration?: number; // In seconds, e.g. 0.85s
}

export default function SeamlessVideoPlayer({
  src,
  poster,
  className = '',
  videoStyle = {},
  crossfadeDuration = 0.85,
}: SeamlessVideoPlayerProps) {
  const [activePlayer, setActivePlayer] = useState<'A' | 'B'>('A');
  const [isReady, setIsReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const playerARef = useRef<HTMLVideoElement>(null);
  const playerBRef = useRef<HTMLVideoElement>(null);
  const activePlayerRef = useRef<'A' | 'B'>('A');
  const isTransitioningRef = useRef(false);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep ref synchronized with state
  activePlayerRef.current = activePlayer;

  // Initialize playback on mount or src change
  useEffect(() => {
    const pA = playerARef.current;
    const pB = playerBRef.current;
    if (!pA || !pB) return;

    pA.currentTime = 0;
    pB.currentTime = 0;
    pA.play().catch(() => {});
    setActivePlayer('A');
    setIsTransitioning(false);
    isTransitioningRef.current = false;

    const readyTimer = setTimeout(() => {
      setIsReady(true);
    }, 400);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const cur = activePlayerRef.current;
        if (cur === 'A' && pA && pA.paused) pA.play().catch(() => {});
        if (cur === 'B' && pB && pB.paused) pB.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearTimeout(readyTimer);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [src]);

  // Ultra-smooth frame-accurate loop crossfading
  useEffect(() => {
    let animationFrameId: number;

    const checkTime = () => {
      const pA = playerARef.current;
      const pB = playerBRef.current;

      if (activePlayerRef.current === 'A' && pA && !isTransitioningRef.current) {
        if (pA.duration && pA.duration > 0 && pA.duration - pA.currentTime <= crossfadeDuration) {
          isTransitioningRef.current = true;
          setIsTransitioning(true);
          if (pB) {
            pB.currentTime = 0;
            pB.play().catch(() => {});
          }
          setActivePlayer('B');

          if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
          resetTimerRef.current = setTimeout(() => {
            if (pA) {
              pA.pause();
              pA.currentTime = 0;
            }
            isTransitioningRef.current = false;
            setIsTransitioning(false);
          }, (crossfadeDuration + 0.1) * 1000);
        }
      } else if (activePlayerRef.current === 'B' && pB && !isTransitioningRef.current) {
        if (pB.duration && pB.duration > 0 && pB.duration - pB.currentTime <= crossfadeDuration) {
          isTransitioningRef.current = true;
          setIsTransitioning(true);
          if (pA) {
            pA.currentTime = 0;
            pA.play().catch(() => {});
          }
          setActivePlayer('A');

          if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
          resetTimerRef.current = setTimeout(() => {
            if (pB) {
              pB.pause();
              pB.currentTime = 0;
            }
            isTransitioningRef.current = false;
            setIsTransitioning(false);
          }, (crossfadeDuration + 0.1) * 1000);
        }
      }

      animationFrameId = requestAnimationFrame(checkTime);
    };

    animationFrameId = requestAnimationFrame(checkTime);
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [crossfadeDuration]);

  const handleEndedA = useCallback(() => {
    const pA = playerARef.current;
    if (pA) {
      pA.pause();
      pA.currentTime = 0;
    }
    isTransitioningRef.current = false;
    setIsTransitioning(false);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
  }, []);

  const handleEndedB = useCallback(() => {
    const pB = playerBRef.current;
    if (pB) {
      pB.pause();
      pB.currentTime = 0;
    }
    isTransitioningRef.current = false;
    setIsTransitioning(false);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
  }, []);

  const markReady = useCallback(() => {
    setIsReady(true);
  }, []);

  // Compute opacities and stacking orders to guarantee zero background peek-through:
  // When active is B and transitioning: B fades in on top (z:2, opacity:1), A stays solid (z:1, opacity:1).
  // When active is A and transitioning: A fades in on top (z:2, opacity:1), B stays solid (z:1, opacity:1).
  const isAVisible = isReady && (activePlayer === 'A' || isTransitioning);
  const isBVisible = isReady && (activePlayer === 'B' || isTransitioning);
  const isAOnTop = activePlayer === 'A';
  const isBOnTop = activePlayer === 'B';

  return (
    <div className={className} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* Player A */}
      <video
        ref={playerARef}
        autoPlay
        muted
        playsInline
        preload="auto"
        poster={poster || undefined}
        src={src}
        onCanPlay={markReady}
        onCanPlayThrough={markReady}
        onLoadedData={markReady}
        onPlaying={markReady}
        onEnded={handleEndedA}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isAVisible ? (activePlayer === 'A' ? 1 : (isTransitioning ? 1 : 0)) : 0,
          zIndex: isAOnTop ? 2 : 1,
          transition: isAOnTop ? `opacity ${crossfadeDuration}s cubic-bezier(0.4, 0, 0.2, 1)` : 'none',
          filter: 'contrast(1.1) saturate(1.24) brightness(1.02)',
          imageRendering: '-webkit-optimize-contrast',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          willChange: 'opacity',
          ...videoStyle,
        }}
      />

      {/* Player B (for seamless crossfade looping) */}
      <video
        ref={playerBRef}
        muted
        playsInline
        preload="auto"
        poster={poster || undefined}
        src={src}
        onCanPlay={markReady}
        onCanPlayThrough={markReady}
        onLoadedData={markReady}
        onPlaying={markReady}
        onEnded={handleEndedB}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isBVisible ? (activePlayer === 'B' ? 1 : (isTransitioning ? 1 : 0)) : 0,
          zIndex: isBOnTop ? 2 : 1,
          transition: isBOnTop ? `opacity ${crossfadeDuration}s cubic-bezier(0.4, 0, 0.2, 1)` : 'none',
          filter: 'contrast(1.1) saturate(1.24) brightness(1.02)',
          imageRendering: '-webkit-optimize-contrast',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          willChange: 'opacity',
          ...videoStyle,
        }}
      />
    </div>
  );
}
