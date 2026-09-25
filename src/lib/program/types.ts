export type Difficulty = "beginner" | "active";

export type TargetArea =
  | "fullBody"
  | "lowerBody"
  | "upperBody"
  | "core"
  | "pelvicFloor"
  | "mobility";

export interface Exercise {
  id: string;
  name: string;
  targetAreas: TargetArea[];
  difficulty: Difficulty[];
  equipment: string;
  jointFriendly: boolean;
  sets: number;
  /** Reps per set. Absent for timed holds such as planks. */
  reps?: number;
  /** Hold time: per set when there are no reps, per rep when there are. */
  durationSeconds?: number;
  restSeconds: number;
  cue: string;
  formTip: string;
}

export interface Program {
  id: string;
  name: string;
  difficulty: Difficulty;
  targetAreas: TargetArea[];
  daysPerWeek: number;
  sessionMinutes: number;
  description: string;
  exerciseIds: string[];
}
