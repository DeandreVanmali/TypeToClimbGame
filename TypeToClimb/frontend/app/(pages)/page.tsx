'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import JungleIcon from '@/graphics/JungleIcon';
import AnimalThumbnail from '@/graphics/AnimalThumbnail';
import { AnimalOption, ANIMAL_OPTIONS } from '@/data/animals';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [nameInput, setNameInput] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalOption>('monkey');

  const handleLogin = () => {
    if (!nameInput.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    // Navigate to lobby with player info - backend will handle auto-join
    router.push(`/lobby?name=${encodeURIComponent(nameInput)}&animal=${encodeURIComponent(selectedAnimal)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#00bf8f] to-[#001510] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/95 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <JungleIcon className="w-24 h-24" />
          </div>
          <h1 className="text-4xl font-black text-jungle-green mb-2">
            Type To Climb
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Enter your name and choose your character
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="name-input" className="block text-lg font-bold text-gray-800 mb-2">
                Your Name
              </label>
              <input
                id="name-input"
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                }}
                placeholder="Type your name..."
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-jungle-green focus:outline-none text-base font-medium"
              />
            </div>

            {/* Character Selection */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3">
                Choose Your Character
              </label>
              <div className="grid grid-cols-4 gap-3">
                {ANIMAL_OPTIONS.map((animal) => (
                  <button
                    key={animal.id}
                    onClick={() => setSelectedAnimal(animal.id)}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 shadow-sm ${
                      selectedAnimal === animal.id
                        ? 'border-jungle-green bg-jungle-green/10 shadow-md scale-105'
                        : 'border-gray-200 hover:border-jungle-green/50'
                    }`}
                  >
                    <AnimalThumbnail animal={animal.id} />
                    <p className="text-sm font-semibold mt-2 capitalize text-gray-700">
                      {animal.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={!nameInput.trim()}
              className="w-full bg-jungle-green hover:bg-jungle-leaf text-white font-bold py-3 text-xl disabled:opacity-50 shadow-md hover:shadow-lg transition-shadow"
            >
              Join Lobby
            </Button>
          </div>
        </div>

        {/* Footer with leaderboard link */}
        <div className="text-center pt-6 border-t border-gray-300">
          <Button
            onClick={() => router.push('/leaderboard')}
            variant="outline"
            className="font-semibold border-2 border-jungle-green text-jungle-green hover:bg-jungle-green/10 text-sm px-6 py-2"
          >
            View Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
}



