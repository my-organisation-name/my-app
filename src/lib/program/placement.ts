import { getProgramEquipment, getProgramExercises, programs } from "./data";
import type { Difficulty, Program, TargetArea } from "./types";

export type Experience = "new" | "returning" | "regular";

export type Focus =
  | "overall"
  | "corePelvicFloor"
  | "mobility"
  | "upperBody"
  | "coreLowerBody";

/** Optional equipment people may have. Bodyweight-only needs nothing. */
export const EQUIPMENT_OPTIONS = [
  "chair",
  "step or low stair",
  "resistance band",
  "light dumbbells",
] as const;

export interface PlacementAnswers {
  experience: Experience;
  focus: Focus;
  daysPerWeek: number;
  minutesPerSession: number;
  equipment: string[];
  sensitiveJoints: boolean;
  /** Any "yes" on the health check keeps someone on gentle programs. */
  healthFlag: boolean;
}

export interface Recommendation {
  program: Program;
  missingEquipment: string[];
}

const FOCUS_AREAS: Record<Focus, TargetArea[]> = {
  overall: ["fullBody"],
  corePelvicFloor: ["core", "pelvicFloor"],
  mobility: ["mobility", "lowerBody"],
  upperBody: ["upperBody"],
  coreLowerBody: ["core", "lowerBody"],
};

export function levelFor(answers: PlacementAnswers): Difficulty {
  if (answers.healthFlag) return "beginner";
  return answers.experience === "regular" ? "active" : "beginner";
}

function score(program: Program, answers: PlacementAnswers): number {
  const wanted = FOCUS_AREAS[answers.focus];
  const overlap = program.targetAreas.filter((a) => wanted.includes(a)).length;
  let total = overlap * 10;

  // Fitting into the person's week matters more than an exact focus match:
  // a plan they can keep up is the one that works.
  if (program.daysPerWeek > answers.daysPerWeek) {
    total -= (program.daysPerWeek - answers.daysPerWeek) * 6;
  }
  if (program.sessionMinutes > answers.minutesPerSession) {
    total -=
      Math.ceil((program.sessionMinutes - answers.minutesPerSession) / 5) * 3;
  }

  const missing = getProgramEquipment(program).filter(
    (eq) => !answers.equipment.includes(eq),
  );
  total -= missing.length * 8;

  if (answers.sensitiveJoints) {
    const hard = getProgramExercises(program).filter((e) => !e.jointFriendly);
    total -= hard.length * 4;
  }

  return total;
}

/**
 * Ranks programs at the person's level, best first. Always returns at least
 * one program so nobody reaches a dead end.
 */
export function recommendPrograms(answers: PlacementAnswers): Recommendation[] {
  const level = levelFor(answers);
  return (
    programs
      .filter((p) => p.difficulty === level)
      .map((program, index) => ({ program, index, s: score(program, answers) }))
      // Stable on ties so the order in programs.json acts as the tiebreaker.
      .sort((a, b) => b.s - a.s || a.index - b.index)
      .map(({ program }) => ({
        program,
        missingEquipment: getProgramEquipment(program).filter(
          (eq) => !answers.equipment.includes(eq),
        ),
      }))
  );
}
