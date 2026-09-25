"use client";

import { getProgram } from "@/lib/program/data";
import {
  progressNudge,
  sessionsThisWeek,
  trialDaysLeft,
  useCompletedSessions,
  useMemberProfile,
} from "@/lib/program/member-store";
import { ProgramSummary } from "@/components/program/ProgramSummary";
import { ButtonLink, Card, Note } from "@/components/ui";

const NUDGES = {
  tryHarder:
    "Your last two sessions felt comfortable. When you're ready, try the “Make it harder” option on one or two exercises.",
  easeOff:
    "Last session felt like a lot. That's useful to know. Next time, try the “Make it easier” option or do one less set. Rest counts as training too.",
};

export default function DashboardPage() {
  const profile = useMemberProfile();
  const sessions = useCompletedSessions();
  const program = profile ? getProgram(profile.programId) : undefined;

  if (!profile || !program) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-bold sm:text-3xl">Welcome</h1>
        <p className="mt-2 text-muted-foreground">
          Let&apos;s find the right place for you to start. It takes about three
          minutes.
        </p>
        <ButtonLink href="/start" className="mt-6">
          Find my starting point
        </ButtonLink>
      </div>
    );
  }

  const done = sessionsThisWeek(sessions);
  const nudge = progressNudge(sessions);
  const daysLeft = trialDaysLeft(profile);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-6 py-10 sm:py-16">
      <p className="text-sm font-medium text-primary">
        Free trial · {daysLeft} {daysLeft === 1 ? "day" : "days"} left
      </p>

      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          {sessions.length === 0 ? "Ready when you are" : "Welcome back"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {done === 0
            ? `Your plan is ${program.daysPerWeek} sessions a week. Any movement is a win.`
            : `${done} of ${program.daysPerWeek} sessions done this week. Lovely work.`}
        </p>
      </div>

      <ButtonLink href="/session" className="w-full sm:w-auto">
        Start today&apos;s session
      </ButtonLink>

      {nudge && (
        <Note tone="accent">
          <p className="text-sm">{NUDGES[nudge]}</p>
        </Note>
      )}

      <Card>
        <ProgramSummary program={program} />
      </Card>

      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
        <span>
          {sessions.length} {sessions.length === 1 ? "session" : "sessions"}{" "}
          completed in total
        </span>
        <ButtonLink href="/start" variant="ghost" className="-ml-5">
          Change my program
        </ButtonLink>
      </div>
    </div>
  );
}
