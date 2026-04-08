export interface WordPayload {
  text: string;
  difficulty: number;
}

export interface SubmitPayload {
  typed: string;
  timeMs: number;
}

export interface ProgressEvent {
  height: number;
  lastIncrement: number;
  accuracy: number;
  timeMs: number;
}

export interface PlayerState {
  name: string;
  height: number;
  accuracyAvg: number;
  avgTimeMs: number;
}

export interface RoomState {
  players: PlayerState[];
  currentWord?: WordPayload;
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
  accuracy: number;
  avgTimeMs: number;
  createdAt: string;
}
