export type AnimalOption = 'monkey' | 'parrot' | 'sloth' | 'tiger';

export const ANIMAL_OPTIONS: { id: AnimalOption; label: string; description: string }[] = [
  { id: 'monkey', label: 'Monkey', description: 'Playful climber' },
  { id: 'parrot', label: 'Parrot', description: 'Bright and brave' },
  { id: 'sloth', label: 'Sloth', description: 'Slow but steady' },
  { id: 'tiger', label: 'Tiger', description: 'Fast jungle friend' },
];
