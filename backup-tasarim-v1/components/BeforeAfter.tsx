"use client";

import { useState, useRef, useCallback } from "react";

interface BeforeAfterProps {
  beforeLabel?: string;
  afterLabel?: string;
  beforeBg: string;
  afterBg: string;
  beforeContent: React.ReactNode;
  afterContent: React.ReactNode;
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
  caption,
  location,
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setPosition(percent);
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) updatePosition(e.clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };
  const handleClick = (e: React.MouseEvent) => {
    updatePosition(e.clientX);
  };

  return (
    <div className="group">
      <div
        ref={containerRef}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-col-resize select-none border border-[var(--carbon-border)] shadow-sm"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={handleClick}
      >
        {/* After (full background) */}
        <div className="absolute inset-0" style={{ background: afterBg }}>
          <div className="absolute inset-0 flex items-center justify-center">
            {afterContent}
          </div>
        </div>

        {/* Before (clipped) */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${100 - position}% 0 0)`,
            background: beforeBg,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {beforeContent}
          </div>
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] md:w-[3px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)] z-20"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          {/* Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 md:w-10 md:h-10 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-blue-500">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="text-blue-600 md:w-5 md:h-5">
              <path d="M6 10L3 7M3 7L6 4M3 7H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 10L17 7M17 7L14 4M17 7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3 z-10">
          <span className="px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-full bg-red-500/90 text-white text-[8px] md:text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
            {beforeLabel}
          </span>
        </div>
        <div className="absolute top-1.5 right-1.5 md:top-3 md:right-3 z-10">
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
