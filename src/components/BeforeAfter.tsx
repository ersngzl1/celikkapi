"use client";

import { useRef, useCallback, useEffect } from "react";
import Image from "next/image";

interface BeforeAfterProps {
  beforeLabel?: string;
  afterLabel?: string;
  beforeBg?: string;
  afterBg?: string;
  beforeContent?: React.ReactNode;
  afterContent?: React.ReactNode;
  before?: string;
  after?: string;
  caption?: string;
  location?: string;
}

export default function BeforeAfter({
  beforeLabel = "Önce",
  afterLabel = "Sonra",
  beforeBg,
  afterBg,
  beforeContent,
  afterContent,
  before,
  after,
  caption,
  location,
}: BeforeAfterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const rafId = useRef<number>(0);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));

    // Direct DOM manipulation — no React re-render
    if (lineRef.current) {
      lineRef.current.style.left = `${percent}%`;
    }
    if (clipRef.current) {
      clipRef.current.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    }
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      updatePosition(e.clientX);
    });
  }, [updatePosition]);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  return (
    <div className="group">
      <div
        ref={containerRef}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-col-resize select-none shadow-sm"
        style={{ border: '1px solid var(--border)', touchAction: 'pan-y pinch-zoom' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* After (full background) */}
        <div className="absolute inset-0" style={{ background: afterBg }}>
          {after ? (
            <Image src={after} alt="Sonra" fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">{afterContent}</div>
          )}
        </div>

        {/* Before (clipped) — direct DOM, no state */}
        <div
          ref={clipRef}
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 50% 0 0)`,
            background: beforeBg,
          }}
        >
          {before ? (
            <Image src={before} alt="Önce" fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">{beforeContent}</div>
          )}
        </div>

        {/* Slider line — direct DOM, no state */}
        <div
          ref={lineRef}
          className="absolute top-0 bottom-0 w-[2px] md:w-[3px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)] z-20"
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full shadow-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', border: '2px solid rgba(255,255,255,0.4)' }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="md:w-5 md:h-5" style={{ color: 'var(--bg-primary)' }}>
              <path d="M6 10L3 7M3 7L6 4M3 7H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 10L17 7M17 7L14 4M17 7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3 z-10 pointer-events-none">
          <span className="px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-full text-[8px] md:text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm" style={{ background: 'rgba(200, 165, 92, 0.85)', color: 'var(--bg-primary)' }}>
            {beforeLabel}
          </span>
        </div>
        <div className="absolute top-1.5 right-1.5 md:top-3 md:right-3 z-10 pointer-events-none">
          <span className="px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-full bg-emerald-500/90 text-white text-[8px] md:text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
            {afterLabel}
          </span>
        </div>
      </div>

      {/* Caption */}
      {(caption || location) && (
        <div className="mt-1.5 md:mt-3 flex flex-col md:flex-row md:items-center md:justify-between px-0.5 md:px-1">
          {caption && <p className="text-[10px] md:text-sm font-semibold text-[var(--text-primary)] leading-tight">{caption}</p>}
          {location && <p className="text-[9px] md:text-xs text-[var(--text-muted)]">{location}</p>}
        </div>
      )}
    </div>
  );
}
