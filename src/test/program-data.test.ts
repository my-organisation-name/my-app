import { describe, expect, it } from "vitest";
import {
  describePrescription,
  exercises,
  getExercise,
  programs,
} from "@/lib/program/data";
import { ladderEntries } from "@/lib/program/ladders";

describe("program data", () => {
  it("has unique exercise and program ids", () => {
    expect(new Set(exercises.map((e) => e.id)).size).toBe(exercises.length);
    expect(new Set(programs.map((p) => p.id)).size).toBe(programs.length);
  });

  it("only references exercises that exist", () => {
    for (const program of programs) {
      for (const id of program.exerciseIds) {
        expect(getExercise(id), `${program.id} → ${id}`).toBeDefined();
      }
    }
  });

  it("gives every exercise either reps or a hold time", () => {
    for (const e of exercises) {
      expect(e.reps ?? e.durationSeconds, e.id).toBeGreaterThan(0);
    }
  });

  it("only links easier/harder swaps to real exercises", () => {
    for (const [id, { easier, harder }] of Object.entries(ladderEntries)) {
      expect(getExercise(id), id).toBeDefined();
      if (easier) expect(getExercise(easier), easier).toBeDefined();
      if (harder) expect(getExercise(harder), harder).toBeDefined();
    }
  });

  it("describes reps, holds and reps-with-holds", () => {
    expect(describePrescription(getExercise("ex001")!)).toBe(
      "3 sets × 12 reps",
    );
    expect(describePrescription(getExercise("ex019")!)).toBe(
      "3 × 30-second holds",
    );
    expect(describePrescription(getExercise("ex009")!)).toBe(
      "3 sets × 10 reps (hold 5 s each)",
    );
  });
});
