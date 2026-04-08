import { AnimalOption } from '../data/animals';

export default function CharacterSVG({ animal }: { animal: AnimalOption }) {
  switch (animal) {
    case 'parrot':
      return (
        <svg viewBox="0 0 100 120" className="w-24 h-28 -translate-x-1/2 ml-[50%]">
          <path d="M36,52 Q22,38 26,18" stroke="#1f8f5a" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M64,52 Q78,38 74,18" stroke="#1f8f5a" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="26" cy="15" r="6" fill="#136b41" /><circle cx="74" cy="15" r="6" fill="#136b41" />
          <ellipse cx="50" cy="68" rx="22" ry="24" fill="#2fbf71" />
          <ellipse cx="50" cy="72" rx="14" ry="16" fill="#b9f4c7" />
          <circle cx="50" cy="38" r="18" fill="#2fbf71" />
          <ellipse cx="44" cy="40" rx="6" ry="5" fill="#e7fff0" />
          <circle cx="43" cy="38" r="4" fill="#ffffff" /><circle cx="43" cy="38" r="2" fill="#1f2937" />
          <polygon points="58,38 76,44 58,51" fill="#f59e0b" />
          <path d="M44,88 Q30,104 26,114" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M56,88 Q64,106 70,114" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'sloth':
      return (
        <svg viewBox="0 0 100 120" className="w-24 h-28 -translate-x-1/2 ml-[50%]">
          <path d="M36,52 Q18,40 24,16" stroke="#8b7b6b" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M64,52 Q82,40 76,16" stroke="#8b7b6b" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="24" cy="14" r="6" fill="#6c5f54" /><circle cx="76" cy="14" r="6" fill="#6c5f54" />
          <ellipse cx="50" cy="66" rx="22" ry="26" fill="#8b7b6b" />
          <ellipse cx="50" cy="72" rx="14" ry="18" fill="#d7c3a5" />
          <circle cx="50" cy="38" r="18" fill="#8b7b6b" />
          <ellipse cx="50" cy="40" rx="12" ry="10" fill="#d7c3a5" />
          <circle cx="44" cy="35" r="4" fill="#4b3f36" /><circle cx="44" cy="35" r="1.5" fill="#fff" />
          <circle cx="56" cy="35" r="4" fill="#4b3f36" /><circle cx="56" cy="35" r="1.5" fill="#fff" />
          <path d="M44,45 Q50,49 56,45" stroke="#6c5f54" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M42,88 Q34,104 38,116" stroke="#8b7b6b" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="38" cy="116" r="5" fill="#6c5f54" />
          <path d="M58,88 Q66,104 62,116" stroke="#8b7b6b" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="62" cy="116" r="5" fill="#6c5f54" />
        </svg>
      );
    case 'tiger':
      return (
        <svg viewBox="0 0 100 120" className="w-24 h-28 -translate-x-1/2 ml-[50%]">
          <path d="M36,52 Q20,38 28,14" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M64,52 Q80,38 72,14" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="28" cy="12" r="6" fill="#b45309" /><circle cx="72" cy="12" r="6" fill="#b45309" />
          <ellipse cx="50" cy="68" rx="22" ry="24" fill="#f59e0b" />
          <ellipse cx="50" cy="72" rx="14" ry="16" fill="#fde68a" />
          <circle cx="50" cy="38" r="18" fill="#f59e0b" />
          <ellipse cx="50" cy="42" rx="10" ry="8" fill="#fde68a" />
          <path d="M36,26 L30,18" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
          <path d="M64,26 L70,18" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
          <circle cx="44" cy="36" r="3.5" fill="#111827" /><circle cx="56" cy="36" r="3.5" fill="#111827" />
          <path d="M44,46 Q50,50 56,46" stroke="#b45309" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M42,90 Q38,106 40,116" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M58,90 Q62,106 60,116" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" fill="none" />
        </svg>
      );
    default: // monkey
      return (
        <svg viewBox="0 0 100 120" className="w-24 h-28 -translate-x-1/2 ml-[50%]">
          <path d="M36,52 Q20,40 26,16" stroke="#8B6914" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M64,52 Q80,40 74,16" stroke="#8B6914" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="26" cy="14" r="6" fill="#6B5010" /><circle cx="74" cy="14" r="6" fill="#6B5010" />
          <ellipse cx="50" cy="68" rx="22" ry="24" fill="#8B6914" />
          <ellipse cx="50" cy="72" rx="14" ry="16" fill="#A0826D" />
          <circle cx="50" cy="38" r="18" fill="#8B6914" />
          <circle cx="40" cy="35" r="7" fill="#8B6914" /><circle cx="40" cy="35" r="4" fill="#6B5010" />
          <circle cx="60" cy="35" r="7" fill="#8B6914" /><circle cx="60" cy="35" r="4" fill="#6B5010" />
          <ellipse cx="50" cy="40" rx="10" ry="8" fill="#D2B48C" />
          <circle cx="46" cy="35" r="3" fill="#fff" /><circle cx="46.5" cy="35.5" r="1.5" fill="#333" />
          <circle cx="54" cy="35" r="3" fill="#fff" /><circle cx="54.5" cy="35.5" r="1.5" fill="#333" />
          <ellipse cx="50" cy="42" rx="2.5" ry="2" fill="#5D4E37" />
          <path d="M46,46 Q50,49 54,46" stroke="#5D4E37" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M42,90 Q36,104 38,116" stroke="#8B6914" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="38" cy="116" r="4.5" fill="#6B5010" />
          <path d="M58,90 Q64,104 62,116" stroke="#8B6914" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="62" cy="116" r="4.5" fill="#6B5010" />
          <path d="M38,70 Q26,76 24,86 Q28,92 36,86" stroke="#8B6914" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      );
  }
}
