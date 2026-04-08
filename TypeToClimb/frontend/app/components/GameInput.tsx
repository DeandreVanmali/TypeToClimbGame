
'use client';

interface GameInputProps {
  word: string;
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  showError?: boolean;
}

export function GameInput({ word, input, onInputChange, onSubmit, disabled = false, showError = false }: GameInputProps) {

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20 flex flex-col gap-3">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">Current Word</label>
        <div className="text-2xl font-bold text-jungle-brown p-3 bg-gray-50 rounded border-2 border-jungle-leaf min-h-[50px] flex items-center select-none">
          {word || '—'}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">Your Answer</label>
        <input
          type="text"
          className={`w-full border-2 rounded px-3 py-2 text-lg focus:outline-none disabled:opacity-50 transition-colors ${
            showError 
              ? 'border-red-500 text-red-600 focus:border-red-600 bg-red-50' 
              : 'border-jungle-leaf focus:border-jungle-green'
          }`}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !disabled) onSubmit(); }}
          placeholder="Type and press Enter"
          disabled={disabled}
          autoFocus
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={disabled || !word}
        className="w-full bg-gradient-to-r from-jungle-green to-[#00d4a0] text-white font-bold py-2 rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        Submit Answer
      </button>
    </div>
  );
}