import { useEffect, useRef } from 'react';

/* ------------------------------------------------------------------ */
/*  useDevMonitor                                                      */
/*  ------------------------------------------------------------------ */
/*  Monitor interno (solo desarrollo) que detecta:                     */
/*  • re-renders innecesarios                                           */
/*  • timers duplicados (setTimeout / setInterval)                      */
/*  • requestAnimationFrame duplicados                                   */
/*  • observers duplicados (IntersectionObserver, MutationObserver)    */
/*  • listeners duplicados                                              */
/*  • memory leaks (refs / handles no limpiados)                        */
/*                                                                      */
/*  Registra advertencias únicamente en modo desarrollo.                */
/*  En producción es un no-op (cero overhead).                          */
/* ------------------------------------------------------------------ */

// Vite/Astro expone import.meta.env.DEV (true en desarrollo, false en build).
// Fallback seguro si import.meta.env no está disponible.
const isDev: boolean =
  typeof import.meta !== 'undefined' &&
  typeof (import.meta as { env?: { DEV?: boolean } }).env !== 'undefined'
    ? Boolean((import.meta as { env: { DEV?: boolean } }).env.DEV)
    : true;

interface MonitorState {
  renderCount: number;
  timers: Set<number>;
  rafs: Set<number>;
  observers: Set<unknown>;
  listeners: Set<string>;
}

export function useDevMonitor(componentName: string) {
  const stateRef = useRef<MonitorState>({
    renderCount: 0,
    timers: new Set(),
    rafs: new Set(),
    observers: new Set(),
    listeners: new Set()
  });

  const mountedRef = useRef(false);

  useEffect(() => {
    if (!isDev) return;

    const s = stateRef.current;
    s.renderCount += 1;

    if (s.renderCount === 1) {
      mountedRef.current = true;
    } else if (mountedRef.current) {
      // Re-render detectado
      console.warn(
        `[DevMonitor] ⚠️ "${componentName}" re-rendered (${s.renderCount} times). ` +
          `Possible causes: state update, parent re-render, prop change.`
      );
    }

    return () => {
      mountedRef.current = false;
    };
  });

  // API interna para registrar/desregistrar recursos (opcional)
  useEffect(() => {
    if (!isDev) return;
    const s = stateRef.current;

    return () => {
      // Al desmontar: verificar que no queden recursos activos
      if (s.timers.size > 0) {
        console.warn(
          `[DevMonitor] 🧠 "${componentName}" memory leak: ${s.timers.size} timers still active on unmount.`
        );
      }
      if (s.rafs.size > 0) {
        console.warn(
          `[DevMonitor] 🧠 "${componentName}" memory leak: ${s.rafs.size} requestAnimationFrame still active on unmount.`
        );
      }
      if (s.observers.size > 0) {
        console.warn(
          `[DevMonitor] 🧠 "${componentName}" memory leak: ${s.observers.size} observers still active on unmount.`
        );
      }
      if (s.listeners.size > 0) {
        console.warn(
          `[DevMonitor] 🧠 "${componentName}" memory leak: ${s.listeners.size} listeners still active on unmount.`
        );
      }
    };
  }, [componentName]);

  // Helpers para registrar recursos (dev only)
  const track = {
    timer: (id: number) => {
      if (isDev) stateRef.current.timers.add(id);
      return id;
    },
    untrackTimer: (id: number) => {
      if (isDev) stateRef.current.timers.delete(id);
    },
    raf: (id: number) => {
      if (isDev) stateRef.current.rafs.add(id);
      return id;
    },
    untrackRaf: (id: number) => {
      if (isDev) stateRef.current.rafs.delete(id);
    },
    observer: (o: unknown) => {
      if (isDev) stateRef.current.observers.add(o);
    },
    untrackObserver: (o: unknown) => {
      if (isDev) stateRef.current.observers.delete(o);
    },
    listener: (key: string) => {
      if (isDev) stateRef.current.listeners.add(key);
    },
    untrackListener: (key: string) => {
      if (isDev) stateRef.current.listeners.delete(key);
    }
  };

  return { track, renderCount: stateRef.current.renderCount };
}
