'use client';

import { useEffect, useRef } from 'react';

interface SmoothWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  baseOpacity: number;
  waveWidth: number;
  rings: number;
  color: string;
}

export default function WaterEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const waves: SmoothWave[] = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const addSmoothWave = (x: number, y: number, isClick = false) => {
      waves.push({
        x,
        y,
        radius: isClick ? 6 : 4,
        maxRadius: isClick ? 180 : 95 + Math.random() * 25,
        speed: isClick ? 2.8 : 1.6,
        baseOpacity: isClick ? 0.7 : 0.42,
        waveWidth: isClick ? 4 : 2.5,
        rings: isClick ? 3 : 2,
        color: isClick ? '217, 70, 239' : '168, 85, 247',
      });
    };

    let lastX = -100;
    let lastY = -100;
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const now = performance.now();

      // Spawn smooth waves along movement path
      if (now - lastTime > 32 && dist > 8) {
        addSmoothWave(e.clientX, e.clientY, false);
        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      addSmoothWave(e.clientX, e.clientY, true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render expanding smooth water ripples
      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i];
        w.radius += w.speed;
        const progress = w.radius / w.maxRadius;

        if (progress >= 1) {
          waves.splice(i, 1);
          continue;
        }

        // Smooth cubic fade-out
        const fade = Math.pow(1 - progress, 1.8);
        const alpha = fade * w.baseOpacity;

        if (alpha <= 0.005) {
          waves.splice(i, 1);
          continue;
        }

        for (let ring = 0; ring < w.rings; ring++) {
          const ringOffset = ring * 18;
          const currentRadius = w.radius - ringOffset;
          if (currentRadius <= 1) continue;

          const ringProgress = currentRadius / w.maxRadius;
          const ringAlpha = Math.pow(Math.max(0, 1 - ringProgress), 1.8) * alpha * (1 - ring * 0.3);

          if (ringAlpha <= 0.005) continue;

          ctx.save();

          // 1. Soft glowing caustic body (broad outer wave)
          ctx.beginPath();
          ctx.arc(w.x, w.y, currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${w.color}, ${ringAlpha * 0.45})`;
          ctx.lineWidth = Math.max(1, w.waveWidth * 2.2 * (1 - ringProgress * 0.7));
          ctx.shadowBlur = 18;
          ctx.shadowColor = `rgba(${w.color}, ${ringAlpha * 0.8})`;
          ctx.stroke();

          // 2. Refractive wave crest (crisp, luminous white-violet highlight)
          ctx.beginPath();
          ctx.arc(w.x, w.y, currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${ringAlpha * 0.85})`;
          ctx.lineWidth = Math.max(0.6, w.waveWidth * (1 - ringProgress * 0.6));
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#ffffff';
          ctx.stroke();

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      aria-hidden="true"
    />
  );
}
