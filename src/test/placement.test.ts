import { describe, expect, it } from "vitest";
import {
  recommendPrograms,
  type PlacementAnswers,
} from "@/lib/program/placement";

const base: PlacementAnswers = {
  experience: "new",
  focus: "overall",
  daysPerWeek: 3,
  minutesPerSession: 20,
  equipment: ["chair"],
  sensitiveJoints: false,
  healthFlag: false,
};

const top = (answers: Partial<PlacementAnswers>) =>
  recommendPrograms({ ...base, ...answers })[0].program;

describe("recommendPrograms", () => {
  it("starts newcomers on the beginner full-body program", () => {
    expect(top({}).id).toBe("prog01");
  });

  it("matches the chosen focus", () => {
    expect(top({ focus: "corePelvicFloor", daysPerWeek: 2 }).id).toBe("prog02");
    expect(top({ focus: "mobility" }).id).toBe("prog03");
  });

  it("offers active programs to regular exercisers", () => {
    const program = top({
      experience: "regular",
      daysPerWeek: 4,
      minutesPerSession: 30,
    });
    expect(program.difficulty).toBe("active");
  });

  it("keeps anyone who flags a health concern on beginner programs", () => {
    const results = recommendPrograms({
      ...base,
      experience: "regular",
      healthFlag: true,
    });
    expect(results.every((r) => r.program.difficulty === "beginner")).toBe(
      true,
    );
  });

  it("prefers programs that fit the time available", () => {
    const program = top({
      experience: "regular",
      daysPerWeek: 3,
      minutesPerSession: 30,
      focus: "upperBody",
      equipment: ["resistance band", "light dumbbells"],
    });
    expect(program.id).toBe("prog05");
    expect(program.daysPerWeek).toBeLessThanOrEqual(3);
  });

  it("reports equipment the person doesn't have", () => {
    const results = recommendPrograms({ ...base, equipment: [] });
    const find = (id: string) => results.find((r) => r.program.id === id);
    expect(find("prog01")?.missingEquipment).toEqual(["chair"]);
    expect(find("prog07")?.missingEquipment).toEqual([]);
  });

  it("always returns at least one program", () => {
    expect(
      recommendPrograms({
        ...base,
        daysPerWeek: 2,
        minutesPerSession: 15,
        equipment: [],
      }).length,
    ).toBeGreaterThan(0);
  });
});
