import { describe, expect, it } from "vitest";
import {
  progressNudge,
  sessionsThisWeek,
  trialDaysLeft,
  type CompletedSession,
  type MemberProfile,
} from "@/lib/program/member-store";

const session = (
  completedAt: string,
  feeling: CompletedSession["feeling"],
) => ({
  completedAt,
  programId: "prog01",
  feeling,
});

describe("member progress helpers", () => {
  it("counts down the free trial and never goes negative", () => {
    const profile = { trialStartedAt: "2026-09-01T09:00:00Z" } as MemberProfile;
    expect(trialDaysLeft(profile, new Date("2026-09-01T10:00:00Z"))).toBe(14);
    expect(trialDaysLeft(profile, new Date("2026-09-05T10:00:00Z"))).toBe(10);
    expect(trialDaysLeft(profile, new Date("2026-10-30T10:00:00Z"))).toBe(0);
  });

  it("counts sessions since Monday", () => {
    // 2026-09-25 is a Friday.
    const now = new Date(2026, 8, 25, 12);
    const sessions = [
      session(new Date(2026, 8, 20, 9).toISOString(), "justRight"), // Sunday before
      session(new Date(2026, 8, 22, 9).toISOString(), "justRight"), // Tuesday
      session(new Date(2026, 8, 24, 9).toISOString(), "justRight"), // Thursday
    ];
    expect(sessionsThisWeek(sessions, now)).toBe(2);
  });

  it("nudges up after two comfortable sessions and eases off after a hard one", () => {
    expect(progressNudge([])).toBeNull();
    expect(progressNudge([session("a", "comfortable")])).toBeNull();
    expect(
      progressNudge([session("a", "comfortable"), session("b", "comfortable")]),
    ).toBe("tryHarder");
    expect(progressNudge([session("a", "tooMuch")])).toBe("easeOff");
  });
});
