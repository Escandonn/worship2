import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { FC, CSSProperties } from 'react';

export interface ParticleBackgroundProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
}

const ParticleBackground: FC<ParticleBackgroundProps> = ({ id = 'ws-registro-particles', className, style }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const options = useMemo(() => {
    const mobile = isMobile;
    return {
      particleCount: mobile ? 25 : 50,
      connectionDistance: mobile ? 80 : 120,
      speed: mobile ? 0.15 : 0.25,
      colors: ['#C8A96A', '#D6C3A5', '#ECE5DA'],
      linkColor: '#C8A96A'
    };
  }, [isMobile]);

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
      color: string;
      alpha: number;
      alphaSpeed: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < options.particleCount; i += 1) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * options.speed,
          vy: (Math.random() - 0.5) * options.speed,
          radius: Math.random() * 2 + 0.8,
          color: options.colors[Math.floor(Math.random() * options.colors.length)],
          alpha: Math.random() * 0.4 + 0.15,
          alphaSpeed: Math.random() * 0.003 + 0.001
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.55 || p.alpha < 0.1) p.alphaSpeed *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = options.linkColor;
      ctx.lineWidth = 0.6;

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < options.connectionDistance) {
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
    draw();

    const handleResize = () => {
      resize();
      createParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [options]);

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
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};

ParticleBackground.displayName = 'ParticleBackground';

export default ParticleBackground;
