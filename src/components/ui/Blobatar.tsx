'use client';

import React, { useMemo } from 'react';

export type BlobatarSilhouette =
  | 'organic'
  | 'round'
  | 'cloud'
  | 'sun'
  | 'droplet'
  | 'capsule'
  | 'hexagon'
  | 'boxy'
  | 'triangle'
  | 'nub';

export interface BlobatarProps {
  name: string;
  size?: number;
  className?: string;
  silhouette?: BlobatarSilhouette;
  animate?: boolean;
}

// Deterministic string hasher (djb2 variant)
function hashString(str: string): number {
  let hash = 5381;
  const s = str.trim().toLowerCase();
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 33) ^ s.charCodeAt(i);
  }
  return Math.abs(hash);
}

// Curated culinary palette families for Foodwok
const PALETTES = [
  {
    name: 'spiced-vermilion',
    head: '#EB3223',
    secondary: '#B91C1C',
    eye: '#FFFFFF',
    pupil: '#1E1B4B',
    accent: '#FDE047',
  },
  {
    name: 'turmeric-saffron',
    head: '#F59E0B',
    secondary: '#D97706',
    eye: '#FFFFFF',
    pupil: '#451A03',
    accent: '#EB3223',
  },
  {
    name: 'smoky-charcoal',
    head: '#334155',
    secondary: '#1E293B',
    eye: '#FFFFFF',
    pupil: '#0F172A',
    accent: '#38BDF8',
  },
  {
    name: 'plantain-emerald',
    head: '#10B981',
    secondary: '#047857',
    eye: '#FFFFFF',
    pupil: '#064E3B',
    accent: '#FEF08A',
  },
  {
    name: 'suya-amber',
    head: '#EA580C',
    secondary: '#C2410C',
    eye: '#FFFFFF',
    pupil: '#431407',
    accent: '#FDE047',
  },
  {
    name: 'aubergine-plum',
    head: '#7C3AED',
    secondary: '#6D28D9',
    eye: '#FFFFFF',
    pupil: '#2E1065',
    accent: '#F472B6',
  },
  {
    name: 'ginger-coral',
    head: '#F43F5E',
    secondary: '#E11D48',
    eye: '#FFFFFF',
    pupil: '#4C0519',
    accent: '#FDE047',
  },
];

const SILHOUETTES: BlobatarSilhouette[] = [
  'organic',
  'round',
  'cloud',
  'sun',
  'droplet',
  'capsule',
  'hexagon',
  'boxy',
  'triangle',
  'nub',
];

export const Blobatar: React.FC<BlobatarProps> = ({
  name,
  size = 40,
  className = '',
  silhouette: forcedSilhouette,
  animate = true,
}) => {
  const { palette, silhouette, eyeSpacing, eyeY, pupilDx, eyeSize, mouthType } = useMemo(() => {
    const h = hashString(name || 'guest');
    const pIndex = h % PALETTES.length;
    const sIndex = Math.floor(h / 7) % SILHOUETTES.length;

    const chosenSilhouette = forcedSilhouette || SILHOUETTES[sIndex];
    const chosenPalette = PALETTES[pIndex];

    const eyeSpacing = 16 + (h % 9); // 16 to 24
    const eyeY = 46 + (Math.floor(h / 3) % 7); // 46 to 52
    const pupilDx = ((h % 5) - 2) * 1.2; // gaze direction -2.4 to +2.4
    const eyeSize = 6 + (Math.floor(h / 11) % 3); // 6 to 8
    const mouthType = Math.floor(h / 13) % 4; // 0=smile, 1=open, 2=dot, 3=line

    return {
      palette: chosenPalette,
      silhouette: chosenSilhouette,
      eyeSpacing,
      eyeY,
      pupilDx,
      eyeSize,
      mouthType,
    };
  }, [name, forcedSilhouette]);

  // SVG paths for the 10 distinct geometric silhouettes
  const renderBodyPath = () => {
    switch (silhouette) {
      case 'organic':
        return (
          <path
            d="M50 10 C76 10, 90 28, 90 52 C90 76, 74 90, 50 90 C24 90, 10 76, 10 52 C10 24, 28 10, 50 10 Z"
            fill="url(#bodyGradient)"
          />
        );
      case 'round':
        return <circle cx="50" cy="50" r="40" fill="url(#bodyGradient)" />;
      case 'cloud':
        return (
          <path
            d="M28 66 C18 66 12 58 14 48 C16 38 26 32 36 34 C40 22 56 18 66 26 C76 22 86 30 86 42 C92 48 90 60 82 66 Z"
            fill="url(#bodyGradient)"
          />
        );
      case 'sun':
        return (
          <g>
            <circle cx="50" cy="50" r="32" fill="url(#bodyGradient)" />
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const x1 = 50 + Math.cos(angle) * 35;
              const y1 = 50 + Math.sin(angle) * 35;
              const x2 = 50 + Math.cos(angle) * 44;
              const y2 = 50 + Math.sin(angle) * 44;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={palette.head}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        );
      case 'droplet':
        return (
          <path
            d="M50 12 C50 12 86 48 86 64 C86 80 70 88 50 88 C30 88 14 80 14 64 C14 48 50 12 50 12 Z"
            fill="url(#bodyGradient)"
          />
        );
      case 'capsule':
        return (
          <rect
            x="18"
            y="12"
            width="64"
            height="76"
            rx="32"
            fill="url(#bodyGradient)"
          />
        );
      case 'hexagon':
        return (
          <polygon
            points="50,12 85,31 85,69 50,88 15,69 15,31"
            fill="url(#bodyGradient)"
          />
        );
      case 'boxy':
        return (
          <rect
            x="14"
            y="14"
            width="72"
            height="72"
            rx="20"
            fill="url(#bodyGradient)"
          />
        );
      case 'triangle':
        return (
          <path
            d="M50 14 C54 14 56 16 58 20 L86 68 C88 72 86 78 82 80 C80 81 78 82 76 82 L24 82 C18 82 14 76 16 70 L42 20 C44 16 46 14 50 14 Z"
            fill="url(#bodyGradient)"
          />
        );
      case 'nub':
      default:
        return (
          <path
            d="M50 14 C72 14 84 26 84 48 C84 72 74 86 50 86 C26 86 16 72 16 48 C16 26 28 14 50 14 Z"
            fill="url(#bodyGradient)"
          />
        );
    }
  };

  // Mouth path
  const renderMouth = () => {
    switch (mouthType) {
      case 0: // Big happy smile
        return (
          <path
            d="M42 66 Q50 74 58 66"
            stroke={palette.pupil}
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        );
      case 1: // Cute open mouth
        return (
          <path
            d="M44 64 Q50 72 56 64 Z"
            fill={palette.secondary}
            stroke={palette.pupil}
            strokeWidth="1.5"
          />
        );
      case 2: // Small pleasant smirk
        return (
          <path
            d="M45 66 Q50 70 55 65"
            stroke={palette.pupil}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        );
      case 3: // Content line
      default:
        return (
          <line
            x1="44"
            y1="66"
            x2="56"
            y2="66"
            stroke={palette.pupil}
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
    }
  };

  const leftEyeX = 50 - eyeSpacing / 2;
  const rightEyeX = 50 + eyeSpacing / 2;

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 select-none ${
        animate ? 'transition-transform duration-300 hover:scale-110' : ''
      } ${className}`}
      style={{ width: size, height: size }}
      title={name}
      aria-label={`${name}'s avatar`}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="w-full h-full overflow-visible drop-shadow-xs"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.head} />
            <stop offset="100%" stopColor={palette.secondary} />
          </linearGradient>
          <radialGradient id="highlight" cx="30%" cy="25%" r="40%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Silhouette Body */}
        {renderBodyPath()}

        {/* Soft specular ambient shine */}
        <circle cx="40" cy="35" r="26" fill="url(#highlight)" pointerEvents="none" />

        {/* Left Eye */}
        <g transform={`translate(${leftEyeX}, ${eyeY})`}>
          <circle cx="0" cy="0" r={eyeSize} fill={palette.eye} />
          <circle cx={pupilDx} cy="0.5" r={eyeSize * 0.55} fill={palette.pupil} />
          <circle cx={pupilDx - 1.2} cy="-1.2" r={eyeSize * 0.22} fill="#FFFFFF" />
        </g>

        {/* Right Eye */}
        <g transform={`translate(${rightEyeX}, ${eyeY})`}>
          <circle cx="0" cy="0" r={eyeSize} fill={palette.eye} />
          <circle cx={pupilDx} cy="0.5" r={eyeSize * 0.55} fill={palette.pupil} />
          <circle cx={pupilDx - 1.2} cy="-1.2" r={eyeSize * 0.22} fill="#FFFFFF" />
        </g>

        {/* Cheeks / Blush */}
        <circle
          cx={leftEyeX - 4}
          cy={eyeY + 8}
          r="4.5"
          fill={palette.accent}
          opacity="0.5"
        />
        <circle
          cx={rightEyeX + 4}
          cy={eyeY + 8}
          r="4.5"
          fill={palette.accent}
          opacity="0.5"
        />

        {/* Mouth */}
        {renderMouth()}
      </svg>
    </div>
  );
};
