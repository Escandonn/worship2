import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';

/* ------------------------------------------------------------------ */
/*  Configuración de partículas (paleta WorshipSaint)                  */
/* ------------------------------------------------------------------ */
const PARTICLE_COLORS = ['#C8A96A', '#B8954E', '#D6C3A5', '#ECE5DA', '#A8843C'];
const LINK_COLOR = 'rgba(200,169,106,0.55)';
const CONNECT_DISTANCE = 150;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  color: string;
  phase: number; // para parpadeo suave
}

/* ------------------------------------------------------------------ */
/*  Hook: Typewriter que alterna frases                                */
/* ------------------------------------------------------------------ */
const PHRASES = [
  'WorshipSaint',
  'Diseño Premium',
  'Experiencias Digitales',
  'Minimalismo Atemporal'
];

function useTypewriter() {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const TYPE_MS = 85; // 70–100 ms por carácter
    const DELETE_MS = 45;
    const HOLD_AFTER_TYPE = 1500; // 1.5s antes de borrar
    const HOLD_AFTER_DELETE = 250;

    const tick = () => {
      const current = PHRASES[phraseIndex];

      if (!deleting) {
        charIndex += 1;
        setText(current.slice(0, charIndex));
        if (charIndex >= current.length) {
          // Frase completa: mantener y luego borrar (salvo la última frase).
          if (phraseIndex === PHRASES.length - 1) {
            return; // Dejar la última frase escrita permanentemente.
          }
          deleting = true;
          timeout = setTimeout(tick, HOLD_AFTER_TYPE);
          return;
        }
        timeout = setTimeout(tick, TYPE_MS);
      } else {
        charIndex -= 1;
        setText(current.slice(0, charIndex));
        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % PHRASES.length;
          timeout = setTimeout(tick, HOLD_AFTER_DELETE);
          return;
        }
        timeout = setTimeout(tick, DELETE_MS);
      }
    };

    timeout = setTimeout(tick, 600); // pequeño retardo inicial
    return () => clearTimeout(timeout);
  }, []);

  // Parpadeo del cursor.
  useEffect(() => {
    const id = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  return { text, showCursor };
}

/* ------------------------------------------------------------------ */
/*  Componente Hero enriquecido                                        */
/* ------------------------------------------------------------------ */
const Hero: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const { text, showCursor } = useTypewriter();

  // Fade-in escalonado al montar.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* ---------------- Canvas de partículas + parallax ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    const parallax = { x: 0, y: 0 };
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let rafId = 0;
    let last = performance.now();
    let running = true;

    const resize = () => {
      const rect = section.getBoundingClientRect();
      const newW = Math.max(1, rect.width);
      const newH = Math.max(1, rect.height);

      // Densidad según dispositivo.
      const vw = window.innerWidth;
      let densityFactor = 1;
      if (vw < 768) densityFactor = 0.3; // móvil: -70%
      else if (vw < 1024) densityFactor = 0.6; // tablet: -40%
      const baseCount = 180; // más cantidad
      const count = Math.max(40, Math.round(baseCount * densityFactor));

      // Re-inicializar partículas si cambió el tamaño o el conteo.
      if (newW !== width || newH !== height || particles.length !== count) {
        width = newW;
        height = newH;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 2.8 + 0.8,
          baseAlpha: Math.random() * 0.45 + 0.35,
          alpha: 0,
          color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          phase: Math.random() * Math.PI * 2
        }));
      }
    };

    resize();

    const render = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 16.67, 3); // normalizado a 60fps
      last = now;

      // Re-dimensionar si la sección cambió de tamaño (layout tardío).
      const rect = section.getBoundingClientRect();
      if (Math.abs(rect.width - width) > 1 || Math.abs(rect.height - height) > 1) {
        resize();
      }

      ctx.clearRect(0, 0, width, height);

      // Parallax suave hacia el mouse (interpolación).
      parallax.x += (mouse.x - parallax.x) * 0.02;
      parallax.y += (mouse.y - parallax.y) * 0.02;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Reaparecer al salir del área.
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Parpadeo suave de opacidad.
        p.phase += 0.01 * dt;
        p.alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.phase));

        // Reacción leve al mouse (repulsión muy sutil).
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 0.01) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 0.6;
          p.y += (dy / dist) * force * 0.6;
        }

        const px = p.x + parallax.x * 0.015;
        const py = p.y + parallax.y * 0.015;

        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }

      // Líneas de conexión muy finas.
      ctx.globalAlpha = 1;
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONNECT_DISTANCE) {
            const opacity = (1 - dist / CONNECT_DISTANCE) * 0.8;
            ctx.strokeStyle = LINK_COLOR;
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.moveTo(a.x + parallax.x * 0.015, a.y + parallax.y * 0.015);
            ctx.lineTo(b.x + parallax.x * 0.015, b.y + parallax.y * 0.015);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    const onResize = () => resize();
    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    section.addEventListener('mouseleave', onMouseLeave);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      section.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  /* ---------------- Estilos de animación escalonada ---------------- */
  const step = (delay: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`
  });

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'clamp(5rem, 10vh, 8rem) clamp(1.25rem, 5vw, 4rem)',
        scrollMarginTop: '72px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #F8F6F2 0%, #ECE5DA 45%, #D6C3A5 100%)'
      }}
    >
      {/* Efectos de luz difuminados (originales) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,169,106,0.35), transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '5%',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(214,195,165,0.45), transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />

      {/* Canvas de partículas (capa 2) */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Glow muy suave (capa 3) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.18), transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(200,169,106,0.3)',
            fontFamily: 'var(--ws-font)',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--ws-text)',
            marginBottom: '1.5rem',
            ...step(0)
          }}
        >
          Premium · Minimalista · Atemporal
        </span>

        <h1
          style={{
            margin: '0 0 1.25rem',
            fontFamily: 'var(--ws-font)',
            fontWeight: 700,
            fontSize: 'clamp(2.75rem, 7vw, 4rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'var(--ws-text)',
            minHeight: '1.05em',
            ...step(200)
          }}
        >
          {text}
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '0.04em',
              marginLeft: '0.04em',
              opacity: showCursor ? 1 : 0,
              color: 'var(--ws-accent)',
              transition: 'opacity 0.15s ease'
            }}
          >
            |
          </span>
        </h1>

        <p
          style={{
            margin: '0 auto 2.5rem',
            fontFamily: 'var(--ws-font)',
            fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
            color: 'var(--ws-text)',
            opacity: mounted ? 0.8 : 0,
            maxWidth: '640px',
            lineHeight: 1.6,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s ease 900ms, transform 0.7s ease 900ms'
          }}
        >
          Diseño premium, minimalista y atemporal. Creamos experiencias que trascienden.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s ease 1300ms, transform 0.7s ease 1300ms'
          }}
        >
          <a
            href="#tienda"
            style={{
              padding: '0.95rem 2rem',
              borderRadius: 'var(--ws-radius-btn)',
              background: 'var(--ws-gradient-btn)',
              color: 'var(--ws-text)',
              fontFamily: 'var(--ws-font)',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: 'var(--ws-shadow-btn)',
              transition: 'var(--ws-transition)'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'var(--ws-shadow-btn-hover)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'var(--ws-shadow-btn)';
            }}
          >
            Explorar tienda
          </a>
          <a
            href="#sobre-nosotros"
            style={{
              padding: '0.95rem 2rem',
              borderRadius: 'var(--ws-radius-btn)',
              background: 'var(--ws-gradient-btn-secondary)',
              border: '1px solid rgba(44,33,24,0.12)',
              color: 'var(--ws-text)',
              fontFamily: 'var(--ws-font)',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: 'var(--ws-shadow-card)',
              transition: 'var(--ws-transition)'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
            }}
          >
            Conócenos
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
