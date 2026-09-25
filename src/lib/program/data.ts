import exercisesJson from "@/data/exercises.json";
import programsJson from "@/data/programs.json";
import type { Exercise, Program } from "./types";

/**
 * The program content lives in src/data/*.json exactly as supplied, so it
 * can be updated without touching code. These accessors add types only.
 */
export const exercises = exercisesJson.exercises as Exercise[];
export const programs = programsJson.programs as Program[];

const exercisesById = new Map(exercises.map((e) => [e.id, e]));
const programsById = new Map(programs.map((p) => [p.id, p]));

export function getExercise(id: string): Exercise | undefined {
  return exercisesById.get(id);
}

export function getProgram(id: string): Program | undefined {
  return programsById.get(id);
}

export function getProgramExercises(program: Program): Exercise[] {
  return program.exerciseIds
    .map((id) => exercisesById.get(id))
    .filter((e): e is Exercise => e !== undefined);
}

/** Equipment a program needs beyond bodyweight, e.g. "chair". */
export function getProgramEquipment(program: Program): string[] {
  const needed = getProgramExercises(program)
    .map((e) => e.equipment)
    .filter((eq) => eq !== "none");
  return [...new Set(needed)];
}

/** "3 sets × 12 reps", "3 × 30-second holds", "3 sets × 10 reps (hold 5 s each)" */
export function describePrescription(exercise: Exercise): string {
  const { sets, reps, durationSeconds } = exercise;
  if (reps && durationSeconds) {
    return `${sets} sets × ${reps} reps (hold ${durationSeconds} s each)`;
  }
  if (reps) {
    return `${sets} sets × ${reps} reps`;
  }
  return `${sets} × ${durationSeconds}-second holds`;
}
