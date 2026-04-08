'use client';
import { useState, useEffect } from 'react';
import { AnimalOption } from '../data/animals';
import CharacterSVG from './CharacterSVG';

interface VineDisplayProps {
  height?: number;
  targetHeight?: number;
  animal?: AnimalOption;
  gameComplete?: boolean;
  onPlayAgain?: () => void;
}

export default function VineDisplay({ height = 0, targetHeight = 15, animal = 'monkey', gameComplete = false, onPlayAgain }: VineDisplayProps) {
  const [characterPosition, setCharacterPosition] = useState(80);

  useEffect(() => {
    const progress = Math.min(Math.max(height / Math.max(1, targetHeight), 0), 1);
    setCharacterPosition(80 - progress * 80);
  }, [height, targetHeight]);

  return (
    <>
      <style>{`
        @keyframes drift-left { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-40px)} }
        @keyframes drift-right { 0%,100%{transform:translateX(0)} 50%{transform:translateX(40px)} }
        .cloud-drift-1{animation:drift-left 8s ease-in-out infinite}
        .cloud-drift-2{animation:drift-right 10s ease-in-out infinite}
        @keyframes leaf-sway { 0%,100%{transform:rotate(-6deg)} 50%{transform:rotate(6deg)} }
        .leaf-sway{animation:leaf-sway 2s ease-in-out infinite}
      `}</style>
      <div className="relative w-full h-full overflow-hidden bg-emerald-900">
        {/* Sky backdrop */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-300 to-emerald-700" />
          <svg viewBox="0 0 400 240" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
            <g className="cloud-drift-1" opacity="0.9" fill="#f8fafc">
              <ellipse cx="70" cy="50" rx="28" ry="14" /><ellipse cx="90" cy="45" rx="22" ry="12" /><ellipse cx="110" cy="52" rx="26" ry="14" />
            </g>
            <g className="cloud-drift-2" opacity="0.85" fill="#ffffff">
              <ellipse cx="260" cy="38" rx="30" ry="14" /><ellipse cx="282" cy="34" rx="20" ry="10" /><ellipse cx="304" cy="40" rx="26" ry="12" />
            </g>
            <path d="M0,170 Q30,120 60,160 Q90,110 120,150 Q150,120 180,160 Q210,110 240,150 Q270,120 300,160 Q330,110 360,150 Q390,120 400,160 L400,240 L0,240 Z" fill="#1b4d2b" />
            <path d="M0,190 Q40,140 80,175 Q120,135 160,175 Q200,130 240,175 Q280,140 320,175 Q360,135 400,175 L400,240 L0,240 Z" fill="#245a33" />
            <path d="M0,210 Q60,170 120,205 Q180,165 240,205 Q300,175 360,205 Q380,195 400,200 L400,240 L0,240 Z" fill="#2a6a3a" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 via-emerald-900/20 to-transparent" />
        </div>

        {/* Vine */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-6 bg-amber-800 rounded-full shadow-lg">
          <div className="absolute inset-0 flex flex-col justify-around py-4">
            {[...Array(16)].map((_, i) => <div key={i} className="w-full h-1.5 bg-amber-900/40 rounded-full" />)}
          </div>
        </div>

        {/* Leaves */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute leaf-sway" style={{
            top: `${10 + i * 11}%`,
            left: i % 2 === 0 ? 'calc(50% - 38px)' : 'calc(50% + 4px)',
            animationDelay: `${i * 0.2}s`,
            transformOrigin: i % 2 === 0 ? 'right center' : 'left center',
          }}>
            <svg viewBox="0 0 30 20" className="w-7 h-5" style={{ transform: i % 2 === 0 ? 'scaleX(-1)' : 'none' }}>
              <path d="M0,10 Q10,0 20,5 Q30,10 20,15 Q10,20 0,10" fill="#2d5016" />
              <path d="M0,10 L20,10" stroke="#1a3d0a" strokeWidth="1" fill="none" />
            </svg>
          </div>
        ))}

        {/* Character */}
        <div className="absolute left-1/2 -translate-x-1/2 z-10" style={{ top: `${characterPosition}%`, transition: 'top 0.8s ease-out' }}>
          <CharacterSVG animal={animal} />
        </div>

        {/* Ground foliage */}
        <div className="absolute bottom-0 left-0 right-0 h-24">
          <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
            <path d="M0,100 Q50,60 100,100" fill="oklch(0.35 0.14 145)" />
            <path d="M80,100 Q130,50 180,100" fill="oklch(0.40 0.15 145)" />
            <path d="M160,100 Q210,55 260,100" fill="oklch(0.35 0.14 145)" />
            <path d="M240,100 Q290,60 340,100" fill="oklch(0.40 0.15 145)" />
            <path d="M320,100 Q370,50 400,100" fill="oklch(0.35 0.14 145)" />
          </svg>
        </div>

        {/* Game complete overlay */}
        {gameComplete && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 p-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-black text-white mb-2">YOU REACHED THE TOP!</h2>
            <p className="text-white text-lg mb-6">The monkey made it to the canopy!</p>
            {onPlayAgain && (
              <button onClick={onPlayAgain} className="bg-jungle-green text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-jungle-leaf transition-colors">
                Play Again
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
