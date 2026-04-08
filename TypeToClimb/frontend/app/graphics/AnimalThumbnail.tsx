import { AnimalOption } from '../data/animals';

export default function AnimalThumbnail({ animal }: { animal: AnimalOption }) {
  switch (animal) {
    case 'parrot':
      return (
        <svg viewBox="0 0 60 60" className="w-10 h-10">
          <circle cx="30" cy="21" r="12" fill="#2fbf71" />
          <ellipse cx="30" cy="42" rx="14" ry="10" fill="#2fbf71" />
          <ellipse cx="30" cy="44" rx="9" ry="6" fill="#b9f4c7" />
          <ellipse cx="26" cy="22" rx="4" ry="3" fill="#e7fff0" />
          <polygon points="40,22 53,26 40,31" fill="#f59e0b" />
          <circle cx="25" cy="22" r="2.5" fill="#ffffff" />
          <circle cx="26" cy="22" r="1.4" fill="#1f2937" />
          <path d="M22,32 Q12,36 13,46" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'sloth':
      return (
        <svg viewBox="0 0 60 60" className="w-10 h-10">
          <circle cx="30" cy="22" r="12" fill="#8b7b6b" />
          <ellipse cx="30" cy="42" rx="14" ry="10" fill="#8b7b6b" />
          <ellipse cx="30" cy="24" rx="8" ry="6" fill="#d7c3a5" />
          <circle cx="26" cy="22" r="3.2" fill="#4b3f36" />
          <circle cx="34" cy="22" r="3.2" fill="#4b3f36" />
          <circle cx="26" cy="22" r="1" fill="#ffffff" />
          <circle cx="34" cy="22" r="1" fill="#ffffff" />
          <path d="M24,28 Q30,32 36,28" stroke="#6c5f54" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M18,38 Q10,40 12,48" stroke="#8b7b6b" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'tiger':
      return (
        <svg viewBox="0 0 60 60" className="w-10 h-10">
          <circle cx="30" cy="22" r="12" fill="#f59e0b" />
          <ellipse cx="30" cy="42" rx="14" ry="10" fill="#f59e0b" />
          <ellipse cx="30" cy="24" rx="8" ry="6" fill="#fde68a" />
          <path d="M24,16 L20,10" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
          <path d="M36,16 L40,10" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
          <circle cx="26" cy="22" r="2.6" fill="#111827" />
          <circle cx="34" cy="22" r="2.6" fill="#111827" />
          <path d="M24,28 Q30,32 36,28" stroke="#b45309" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M18,40 L10,44" stroke="#7c2d12" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    default: // monkey
      return (
        <svg viewBox="0 0 60 60" className="w-10 h-10">
          <circle cx="30" cy="22" r="12" fill="#8B6914" />
          <ellipse cx="30" cy="42" rx="14" ry="10" fill="#8B6914" />
          <ellipse cx="30" cy="24" rx="8" ry="6" fill="#D2B48C" />
          <circle cx="26" cy="22" r="3" fill="#ffffff" />
          <circle cx="34" cy="22" r="3" fill="#ffffff" />
          <circle cx="27" cy="22" r="1.5" fill="#1f2937" />
          <circle cx="35" cy="22" r="1.5" fill="#1f2937" />
          <path d="M24,28 Q30,32 36,28" stroke="#6B5010" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M18,38 Q10,36 9,28" stroke="#8B6914" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      );
  }
}
