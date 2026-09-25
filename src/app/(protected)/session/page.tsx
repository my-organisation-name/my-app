"use client";

import { useState } from "react";
import {
  describePrescription,
  getExercise,
  getProgram,
} from "@/lib/program/data";
import { getEasierExercise, getHarderExercise } from "@/lib/program/ladders";
import {
  recordSession,
  saveSwap,
  useMemberProfile,
  type Feeling,
} from "@/lib/program/member-store";
import { Button, ButtonLink, Card } from "@/components/ui";

const FEELINGS: { value: Feeling; label: string; emoji: string }[] = [
  { value: "comfortable", label: "Comfortable", emoji: "😌" },
  { value: "justRight", label: "Challenging but doable", emoji: "💪" },
  { value: "tooMuch", label: "Too much today", emoji: "😮‍💨" },
];

export default function SessionPage() {
  const profile = useMemberProfile();
  const program = profile ? getProgram(profile.programId) : undefined;

  const [index, setIndex] = useState(0);
  const [setsDone, setSetsDone] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feeling, setFeeling] = useState<Feeling | null>(null);

  if (!profile || !program) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <p>Let&apos;s choose a program first.</p>
        <ButtonLink href="/start" className="mt-6">
          Find my starting point
        </ButtonLink>
      </div>
    );
  }

  if (feeling) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-16 text-center">
        <p className="text-5xl" aria-hidden>
          🌿
        </p>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
          Session done. Well done you.
        </h1>
        <p className="mt-2 text-muted-foreground">
          Every session builds strength that stays with you. We&apos;ll use how
          it felt to guide your next one.
        </p>
        <ButtonLink href="/dashboard" className="mt-8">
          Back to my dashboard
        </ButtonLink>
      </div>
    );
  }

  if (finished) {
    const finish = (value: Feeling) => {
      recordSession({
        completedAt: new Date().toISOString(),
        programId: program.id,
        feeling: value,
      });
      setFeeling(value);
    };
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-bold sm:text-3xl">
          How did that feel overall?
        </h1>
        <p className="mt-2 text-muted-foreground">
          There&apos;s no right answer. This just helps us pitch your next
          session.
        </p>
        <div className="mt-6 grid gap-3">
          {FEELINGS.map((f) => (
            <Button
              key={f.value}
              variant="secondary"
              className="justify-start gap-3"
              onClick={() => finish(f.value)}
            >
              <span aria-hidden>{f.emoji}</span>
              {f.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const originalId = program.exerciseIds[index];
  const exercise = getExercise(profile.swaps[originalId] ?? originalId);
  if (!exercise) return null;

  const easier = getEasierExercise(exercise.id);
  const harder = getHarderExercise(exercise.id);
  const isLast = index === program.exerciseIds.length - 1;
  const needsKit =
    exercise.equipment !== "none" &&
    !profile.answers.equipment.includes(exercise.equipment);

  const swapTo = (id: string) => {
    saveSwap(originalId, id);
    setSetsDone(0);
  };

  const goNext = () => {
    setSetsDone(0);
    if (isLast) {
      setFinished(true);
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10 sm:py-16">
      <p className="text-sm text-muted-foreground">
        {program.name} · Exercise {index + 1} of {program.exerciseIds.length}
      </p>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{
            width: `${(index / program.exerciseIds.length) * 100}%`,
          }}
        />
      </div>

      <Card className="mt-6">
        <h1 className="text-2xl font-bold sm:text-3xl">{exercise.name}</h1>
        <p className="mt-2 text-lg font-medium text-primary">
          {describePrescription(exercise)}
        </p>
        <p className="text-sm text-muted-foreground">
          Rest about {exercise.restSeconds} seconds between sets
          {exercise.equipment !== "none" &&
            ` · You'll need: ${exercise.equipment}`}
        </p>

        <h2 className="mt-6 font-semibold">How to do it</h2>
        <p className="mt-1">{exercise.cue}</p>
        <h2 className="mt-4 font-semibold">Tip</h2>
        <p className="mt-1">{exercise.formTip}</p>

        {needsKit && (
          <p className="mt-4 rounded-xl bg-muted p-3 text-sm">
            No {exercise.equipment}? That&apos;s fine. Skip this one today or
            try an easier option.
          </p>
        )}

        <fieldset className="mt-6">
          <legend className="font-semibold">Tick off your sets</legend>
          <div className="mt-2 flex gap-3">
            {Array.from({ length: exercise.sets }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-pressed={i < setsDone}
                aria-label={`Set ${i + 1}`}
                onClick={() => setSetsDone(i < setsDone ? i : i + 1)}
                className={`h-12 w-12 rounded-full border-2 text-sm font-semibold transition-colors ${
                  i < setsDone
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card"
                }`}
              >
                {i < setsDone ? "✓" : i + 1}
              </button>
            ))}
          </div>
        </fieldset>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {easier ? (
          <Button variant="secondary" onClick={() => swapTo(easier.id)}>
            Make it easier
          </Button>
        ) : (
          <p className="self-center text-sm text-muted-foreground">
            Want it easier? Do fewer reps or a smaller movement.
          </p>
        )}
        {harder ? (
          <Button variant="secondary" onClick={() => swapTo(harder.id)}>
            Make it harder
          </Button>
        ) : (
          <p className="self-center text-sm text-muted-foreground">
            Want more? Slow the movement down or add a few reps.
          </p>
        )}
      </div>
      {exercise.id !== originalId && (
        <p className="mt-3 text-sm text-muted-foreground">
          We&apos;ll remember this choice for next time.{" "}
          <button
            type="button"
            className="font-semibold text-primary underline"
            onClick={() => swapTo(originalId)}
          >
            Go back to {getExercise(originalId)?.name}
          </button>
        </p>
      )}

      <Button className="mt-8 w-full" onClick={goNext}>
        {isLast ? "Finish session" : "Next exercise"}
      </Button>
    </div>
  );
}
