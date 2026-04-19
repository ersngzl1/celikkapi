"use client";

interface DoorSVGProps {
  colorHex?: string;
  className?: string;
  style?: "modern" | "classic" | "panel" | "glass";
}

export default function DoorSVG({
  colorHex = "#3B3B3B",
  className = "",
  style = "modern",
}: DoorSVGProps) {
  const lighten = (hex: string, amount: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, ((num >> 16) & 0xff) + amount);
    const g = Math.min(255, ((num >> 8) & 0xff) + amount);
    const b = Math.min(255, (num & 0xff) + amount);
    return `rgb(${r},${g},${b})`;
  };

  const darken = (hex: string, amount: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, ((num >> 16) & 0xff) - amount);
    const g = Math.max(0, ((num >> 8) & 0xff) - amount);
    const b = Math.max(0, (num & 0xff) - amount);
    return `rgb(${r},${g},${b})`;
  };

  const handleColor = "#94A3B8";

  if (style === "modern") {
    return (
      <svg viewBox="0 0 200 340" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`door-grad-${colorHex}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={lighten(colorHex, 30)} />
            <stop offset="100%" stopColor={colorHex} />
          </linearGradient>
        </defs>
        <rect x="5" y="5" width="190" height="330" rx="3" fill="#CBD5E1" />
        <rect x="15" y="12" width="170" height="316" rx="2" fill={`url(#door-grad-${colorHex})`} />
        <line x1="15" y1="90" x2="185" y2="90" stroke={lighten(colorHex, 15)} strokeWidth="0.5" opacity="0.4" />
        <line x1="15" y1="180" x2="185" y2="180" stroke={lighten(colorHex, 15)} strokeWidth="0.5" opacity="0.4" />
        <line x1="15" y1="250" x2="185" y2="250" stroke={lighten(colorHex, 15)} strokeWidth="0.5" opacity="0.4" />
        <rect x="155" y="155" width="8" height="40" rx="4" fill={handleColor} opacity="0.9" />
        <circle cx="159" cy="200" r="5" fill={handleColor} opacity="0.7" />
        <rect x="20" y="15" width="60" height="310" rx="1" fill="white" opacity="0.06" />
      </svg>
    );
  }

  if (style === "classic") {
    return (
      <svg viewBox="0 0 200 340" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`door-classic-${colorHex}`} x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor={lighten(colorHex, 20)} />
            <stop offset="100%" stopColor={colorHex} />
          </linearGradient>
        </defs>
        <rect x="5" y="5" width="190" height="330" rx="3" fill="#CBD5E1" />
        <rect x="15" y="12" width="170" height="316" rx="2" fill={`url(#door-classic-${colorHex})`} />
        <rect x="30" y="30" width="140" height="80" rx="2" fill={darken(colorHex, 10)} stroke={lighten(colorHex, 25)} strokeWidth="1" opacity="0.6" />
        <rect x="30" y="125" width="140" height="80" rx="2" fill={darken(colorHex, 10)} stroke={lighten(colorHex, 25)} strokeWidth="1" opacity="0.6" />
        <rect x="30" y="220" width="140" height="90" rx="2" fill={darken(colorHex, 10)} stroke={lighten(colorHex, 25)} strokeWidth="1" opacity="0.6" />
        <circle cx="157" cy="175" r="8" fill="none" stroke={handleColor} strokeWidth="2" opacity="0.8" />
        <circle cx="157" cy="175" r="3" fill={handleColor} opacity="0.7" />
        <rect x="20" y="15" width="50" height="310" rx="1" fill="white" opacity="0.05" />
      </svg>
    );
  }

  if (style === "glass") {
    return (
      <svg viewBox="0 0 200 340" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="190" height="330" rx="3" fill="#CBD5E1" />
        <rect x="15" y="12" width="170" height="316" rx="2" fill={colorHex} />
        <rect x="35" y="30" width="130" height="160" rx="3" fill="#93C5FD" opacity="0.3" />
        <rect x="35" y="30" width="130" height="160" rx="3" fill="white" opacity="0.15" />
        <line x1="45" y1="35" x2="45" y2="185" stroke="white" strokeWidth="0.5" opacity="0.2" />
        <line x1="155" y1="35" x2="155" y2="185" stroke="white" strokeWidth="0.5" opacity="0.1" />
        <rect x="88" y="210" width="24" height="4" rx="2" fill={handleColor} opacity="0.8" />
        <rect x="155" y="155" width="8" height="40" rx="4" fill={handleColor} opacity="0.9" />
        <rect x="20" y="15" width="50" height="310" rx="1" fill="white" opacity="0.05" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 340" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="190" height="330" rx="3" fill="#CBD5E1" />
      <rect x="15" y="12" width="170" height="316" rx="2" fill={colorHex} />
      <rect x="25" y="25" width="65" height="140" rx="2" fill={lighten(colorHex, 15)} opacity="0.5" />
      <rect x="25" y="175" width="65" height="140" rx="2" fill={lighten(colorHex, 15)} opacity="0.5" />
      <rect x="105" y="25" width="65" height="140" rx="2" fill={lighten(colorHex, 15)} opacity="0.5" />
      <rect x="105" y="175" width="65" height="140" rx="2" fill={lighten(colorHex, 15)} opacity="0.5" />
      <rect x="155" y="155" width="8" height="40" rx="4" fill={handleColor} opacity="0.9" />
      <rect x="20" y="15" width="50" height="310" rx="1" fill="white" opacity="0.05" />
    </svg>
  );
}
