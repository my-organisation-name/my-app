import { getExercise } from "./data";
import type { Exercise } from "./types";

/**
 * Easier / harder swaps between exercises in the library.
 *
 * PROPOSED — these links are not in the supplied program data and should be
 * reviewed by the program's exercise professional. Exercises missing here
 * simply have no swap yet; the session screen then suggests adjusting reps
 * instead. Kept separate from src/data so the supplied files stay untouched.
 */
const LADDER: Record<string, { easier?: string; harder?: string }> = {
  // Squat pattern: Sit to Stand → Bodyweight Squat → Reverse Lunge
  ex021: { harder: "ex001" },
  ex001: { easier: "ex021", harder: "ex022" },
  ex022: { easier: "ex001" },
  ex011: { easier: "ex021" },
  // Push pattern: Wall → Knee → Standard push-up
  ex003: { harder: "ex004" },
  ex004: { easier: "ex003", harder: "ex005" },
  ex005: { easier: "ex004" },
  // Plank: knees → full
  ex020: { harder: "ex019" },
  ex019: { easier: "ex020" },
  // Back extension: Bird Dog is the gentler version of Superman
  ex024: { easier: "ex006" },
  // Overhead: Wall Angels → light dumbbell press
  ex015: { harder: "ex014" },
  ex014: { easier: "ex015" },
};

export function getEasierExercise(id: string): Exercise | undefined {
  const easierId = LADDER[id]?.easier;
  return easierId ? getExercise(easierId) : undefined;
}

export function getHarderExercise(id: string): Exercise | undefined {
  const harderId = LADDER[id]?.harder;
  return harderId ? getExercise(harderId) : undefined;
}

export const ladderEntries = LADDER;
