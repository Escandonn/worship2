import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { FC, CSSProperties } from 'react';

export interface ParticleBackgroundProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
}

const COLORS = {
  brown: '#2D241D',
  gold: '#C9A45C',
  beige: '#D8C29A',
  ivory: '#F7F3EA',
  whiteWarm: '#FFFDF8'
};

const ParticleBackground: FC<ParticleBackgroundProps> = ({ id = 'ws-registro-particles', className, style }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handler);
    return () => motionQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const options = useMemo(() => {
    const mobile = isMobile;
    return {
      particleCount: mobile ? 40 : 80,
      connectionDistance: mobile ? 100 : 150,
      speed: prefersReducedMotion ? 0.05 : mobile ? 0.15 : 0.25,
      colors: [COLORS.gold, COLORS.beige, COLORS.ivory, COLORS.whiteWarm],
      linkColor: COLORS.gold,
      linkOpacity: mobile ? 0.08 : 0.12,
      geometryOpacity: mobile ? 0.03 : 0.05
    };
  }, [isMobile, prefersReducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;
      color: string;
      alpha: number;
      baseAlpha: number;
      alphaSpeed: number;
      phase: number;
      layer: 'micro' | 'medium' | 'front';
      glowSize: number;
      glowAlpha: number;
      baseGlowAlpha: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = options.particleCount;
      
      for (let i = 0; i < count; i += 1) {
        const layerRand = Math.random();
        let layer: 'micro' | 'medium' | 'front';
        let radius: number;
        let alpha: number;
        let glowSize: number;
        let glowAlpha: number;

        if (layerRand < 0.6) {
          layer = 'micro';
          radius = Math.random() * 1.2 + 0.4;
          alpha = Math.random() * 0.25 + 0.1;
          glowSize = 0;
          glowAlpha = 0;
        } else if (layerRand < 0.9) {
          layer = 'medium';
          radius = Math.random() * 2 + 1;
          alpha = Math.random() * 0.35 + 0.2;
          glowSize = Math.random() * 4 + 2;
          glowAlpha = Math.random() * 0.15 + 0.05;
        } else {
          layer = 'front';
          radius = Math.random() * 2.5 + 1.5;
          alpha = Math.random() * 0.4 + 0.25;
          glowSize = Math.random() * 6 + 3;
          glowAlpha = Math.random() * 0.2 + 0.1;
        }

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * options.speed * (layer === 'front' ? 0.7 : 1),
          vy: (Math.random() - 0.5) * options.speed * (layer === 'front' ? 0.7 : 1),
          radius,
          baseRadius: radius,
          color: options.colors[Math.floor(Math.random() * options.colors.length)],
          alpha,
          baseAlpha: alpha,
          alphaSpeed: Math.random() * 0.004 + 0.001,
          phase: Math.random() * Math.PI * 2,
          layer,
          glowSize,
          glowAlpha,
          baseGlowAlpha: glowAlpha
        });
      }
    };

    const drawGeometry = (time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.35;
      
      ctx.globalAlpha = options.geometryOpacity;
      ctx.strokeStyle = COLORS.gold;
      ctx.lineWidth = 0.5;

      const breathe = Math.sin(time * 0.0003) * 0.3 + 0.7;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * breathe, 0, Math.PI * 1.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius * 0.6, centerY - maxRadius * 0.3);
      ctx.lineTo(centerX + maxRadius * 0.6, centerY - maxRadius * 0.3);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius * 0.3, centerY + maxRadius * 0.4);
      ctx.lineTo(centerX + maxRadius * 0.3, centerY + maxRadius * 0.4);
      ctx.stroke();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawGeometry(time);

      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.vx + Math.sin(time * 0.001 + p.phase) * 0.1;
          p.y += p.vy + Math.cos(time * 0.001 + p.phase) * 0.1;

          if (p.x < -50) p.x = canvas.width + 50;
          if (p.x > canvas.width + 50) p.x = -50;
          if (p.y < -50) p.y = canvas.height + 50;
          if (p.y > canvas.height + 50) p.y = -50;

          p.alpha += p.alphaSpeed;
          if (p.alpha > p.baseAlpha + 0.15 || p.alpha < p.baseAlpha - 0.1) {
            p.alphaSpeed *= -1;
          }
          p.alpha = Math.max(0.05, Math.min(p.baseAlpha + 0.15, p.alpha));

          if (p.glowSize > 0) {
            p.glowAlpha += p.alphaSpeed * 0.5;
            if (p.glowAlpha > p.baseGlowAlpha + 0.1 || p.glowAlpha < p.baseGlowAlpha - 0.05) {
              p.alphaSpeed *= -1;
            }
            p.glowAlpha = Math.max(0.02, Math.min(p.baseGlowAlpha + 0.1, p.glowAlpha));
          }
        }

        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        
        if (distToMouse < 120 && !prefersReducedMotion) {
          const force = (120 - distToMouse) / 120;
          p.x += dx * force * 0.01;
          p.y += dy * force * 0.01;
        }

        if (p.glowSize > 0 && p.glowAlpha > 0) {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowSize);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.globalAlpha = p.glowAlpha * 0.3;
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.glowSize, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = options.linkOpacity;
      ctx.strokeStyle = options.linkColor;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < options.connectionDistance) {
            const opacity = (1 - dist / options.connectionDistance) * options.linkOpacity;
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    createParticles();
    draw(0);

    const handleResize = () => {
      resize();
      createParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [options, prefersReducedMotion]);

  const wrapperStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
    ...style
  };

    return (
    <div className={className} style={wrapperStyle} aria-hidden="true">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', border: '2px solid red' }} />
    </div>
  );
};

ParticleBackground.displayName = 'ParticleBackground';

export default ParticleBackground;
