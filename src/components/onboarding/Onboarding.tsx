"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/mock-auth-context";
import {
  saveProfile,
  TRIAL_LENGTH_DAYS,
  useMemberProfile,
} from "@/lib/program/member-store";
import {
  EQUIPMENT_OPTIONS,
  recommendPrograms,
  type Experience,
  type Focus,
  type PlacementAnswers,
} from "@/lib/program/placement";
import { ProgramSummary } from "@/components/program/ProgramSummary";
import { Button, Card, ChoiceCard, Note } from "@/components/ui";

/**
 * Plain-language wording of the general questions in the PAR-Q+ screening
 * questionnaire. Should be checked by the program's exercise professional.
 */
const HEALTH_QUESTIONS = [
  "A doctor has told me I have a heart condition or high blood pressure",
  "I feel pain in my chest at rest, during daily activities, or when active",
  "I've lost my balance from dizziness, or lost consciousness, in the last 12 months",
  "I've been diagnosed with another ongoing medical condition",
  "I take prescribed medication for an ongoing medical condition",
  "I have a bone, joint or soft-tissue problem that activity could make worse",
  "A doctor has said I should only exercise under medical supervision",
];

const EXPERIENCE_OPTIONS: { value: Experience; label: string; hint: string }[] =
  [
    {
      value: "new",
      label: "I'm new to strength exercise",
      hint: "Or it's been so long it feels new. That's a great place to start.",
    },
    {
      value: "returning",
      label: "I'm getting back into it",
      hint: "I've done some before and want to ease back in.",
    },
    {
      value: "regular",
      label: "I already exercise most weeks",
      hint: "I'm ready to build on what I'm doing.",
    },
  ];

const FOCUS_OPTIONS: { value: Focus; label: string; hint: string }[] = [
  {
    value: "overall",
    label: "Feel stronger all over",
    hint: "Not sure? This is a lovely place to start.",
  },
  {
    value: "corePelvicFloor",
    label: "Core and pelvic floor",
    hint: "Support for the changes many women notice around menopause.",
  },
  {
    value: "mobility",
    label: "Move more easily",
    hint: "Loosen stiff hips and back, with some leg strength.",
  },
  {
    value: "upperBody",
    label: "Stronger arms, back and shoulders",
    hint: "For lifting, carrying and reaching with confidence.",
  },
  {
    value: "coreLowerBody",
    label: "Strong legs and core",
    hint: "For stairs, walks and getting up off the floor.",
  },
];

const DAYS_OPTIONS = [2, 3, 4, 5];
const MINUTES_OPTIONS = [15, 20, 30, 45];

const EQUIPMENT_LABELS: Record<(typeof EQUIPMENT_OPTIONS)[number], string> = {
  chair: "A sturdy chair",
  "step or low stair": "A step or low stair",
  "resistance band": "A resistance band",
  "light dumbbells": "Light dumbbells (or full water bottles)",
};

const STEPS = [
  "welcome",
  "health",
  "experience",
  "focus",
  "time",
  "equipment",
  "result",
] as const;

type Step = (typeof STEPS)[number];

function StepHeading({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      {intro && <p className="mt-2 text-muted-foreground">{intro}</p>}
    </div>
  );
}

export function Onboarding() {
  const router = useRouter();
  const { login } = useAuth();
  const existing = useMemberProfile();

  const [step, setStep] = useState<Step>("welcome");
  const [healthYes, setHealthYes] = useState<string[]>([]);
  const [pelvicSymptoms, setPelvicSymptoms] = useState(false);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [focus, setFocus] = useState<Focus | null>(null);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [minutesPerSession, setMinutesPerSession] = useState(20);
  const [equipment, setEquipment] = useState<string[]>(["chair"]);
  const [sensitiveJoints, setSensitiveJoints] = useState(false);
  const [chosenId, setChosenId] = useState<string | null>(null);

  const stepIndex = STEPS.indexOf(step);
  const next = () => setStep(STEPS[stepIndex + 1]);
  const back = () => setStep(STEPS[stepIndex - 1]);

  const toggle = (list: string[], item: string) =>
    list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

  const answers: PlacementAnswers | null =
    experience && focus
      ? {
          experience,
          focus,
          daysPerWeek,
          minutesPerSession,
          equipment,
          sensitiveJoints,
          healthFlag: healthYes.length > 0,
        }
      : null;

  const recommendations = answers ? recommendPrograms(answers) : [];
  const chosen =
    recommendations.find((r) => r.program.id === chosenId) ??
    recommendations[0];

  const startTrial = () => {
    if (!answers || !chosen) return;
    const sameProgram = existing?.programId === chosen.program.id;
    saveProfile({
      programId: chosen.program.id,
      answers,
      // Changing program later must not restart the free trial.
      trialStartedAt: existing?.trialStartedAt ?? new Date().toISOString(),
      swaps: sameProgram ? existing.swaps : {},
    });
    login();
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10 sm:py-16">
      {step !== "welcome" && (
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" onClick={back} className="-ml-5">
            ← Back
          </Button>
          <span className="text-sm text-muted-foreground">
            Step {stepIndex} of {STEPS.length - 1}
          </span>
        </div>
      )}

      {step === "welcome" && (
        <div>
          <StepHeading
            title="Wherever you're starting from, you're in the right place."
            intro="A few gentle questions so we can suggest a program that fits your body, your week and what you have at home. There are no wrong answers, and you can change your mind any time."
          />
          <Button onClick={next}>Let&apos;s begin</Button>
        </div>
      )}

      {step === "health" && (
        <fieldset>
          <legend className="contents">
            <StepHeading
              title="First, a quick health check"
              intro="Tick any that apply to you. This helps us keep things safe. It isn't a test."
            />
          </legend>
          <div className="space-y-3">
            {HEALTH_QUESTIONS.map((q) => (
              <ChoiceCard
                key={q}
                type="checkbox"
                name="health"
                label={q}
                checked={healthYes.includes(q)}
                onChange={() => setHealthYes(toggle(healthYes, q))}
              />
            ))}
            <ChoiceCard
              type="checkbox"
              name="pelvic"
              label="I notice leaking, heaviness or discomfort in my pelvic floor"
              hint="Very common around menopause, and very treatable."
              checked={pelvicSymptoms}
              onChange={() => setPelvicSymptoms(!pelvicSymptoms)}
            />
          </div>

          {healthYes.length > 0 && (
            <div className="mt-6">
              <Note tone="warning">
                <p className="font-semibold">Thank you for letting us know.</p>
                <p className="mt-1 text-sm">
                  Please check in with your GP before you start, and let them
                  know you&apos;re planning some gentle strength work.
                  We&apos;ll start you on our gentlest programs, and you can
                  move up whenever you&apos;re ready.
                </p>
              </Note>
            </div>
          )}
          {pelvicSymptoms && (
            <div className="mt-4">
              <Note tone="accent">
                <p className="text-sm">
                  A women&apos;s health physiotherapist can assess your pelvic
                  floor and tailor exercises for you. It&apos;s well worth a
                  visit. In the meantime, skip any exercise that brings on
                  symptoms.
                </p>
              </Note>
            </div>
          )}

          <Button className="mt-8" onClick={next}>
            {healthYes.length === 0 && !pelvicSymptoms
              ? "None of these apply, continue"
              : "Continue"}
          </Button>
        </fieldset>
      )}

      {step === "experience" && (
        <fieldset>
          <legend className="contents">
            <StepHeading title="Where are you starting from?" />
          </legend>
          <div className="space-y-3">
            {EXPERIENCE_OPTIONS.map((o) => (
              <ChoiceCard
                key={o.value}
                type="radio"
                name="experience"
                label={o.label}
                hint={o.hint}
                checked={experience === o.value}
                onChange={() => setExperience(o.value)}
              />
            ))}
          </div>
          <Button className="mt-8" onClick={next} disabled={!experience}>
            Continue
          </Button>
        </fieldset>
      )}

      {step === "focus" && (
        <fieldset>
          <legend className="contents">
            <StepHeading title="What would you most like to feel?" />
          </legend>
          <div className="space-y-3">
            {FOCUS_OPTIONS.map((o) => (
              <ChoiceCard
                key={o.value}
                type="radio"
                name="focus"
                label={o.label}
                hint={o.hint}
                checked={focus === o.value}
                onChange={() => setFocus(o.value)}
              />
            ))}
          </div>
          <Button className="mt-8" onClick={next} disabled={!focus}>
            Continue
          </Button>
        </fieldset>
      )}

      {step === "time" && (
        <div>
          <StepHeading
            title="How much time feels realistic?"
            intro="Pick what fits a normal week, not your best week. Consistency matters far more than long sessions."
          />
          <fieldset>
            <legend className="mb-3 font-semibold">Days a week</legend>
            <div className="grid grid-cols-4 gap-3">
              {DAYS_OPTIONS.map((d) => (
                <ChoiceCard
                  key={d}
                  type="radio"
                  name="days"
                  label={`${d}`}
                  checked={daysPerWeek === d}
                  onChange={() => setDaysPerWeek(d)}
                />
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-6">
            <legend className="mb-3 font-semibold">Minutes per session</legend>
            <div className="grid grid-cols-4 gap-3">
              {MINUTES_OPTIONS.map((m) => (
                <ChoiceCard
                  key={m}
                  type="radio"
                  name="minutes"
                  label={`${m}`}
                  checked={minutesPerSession === m}
                  onChange={() => setMinutesPerSession(m)}
                />
              ))}
            </div>
          </fieldset>
          <Button className="mt-8" onClick={next}>
            Continue
          </Button>
        </div>
      )}

      {step === "equipment" && (
        <div>
          <StepHeading
            title="What do you have at home?"
            intro="Nothing at all is fine. Many of our exercises use just your body."
          />
          <fieldset>
            <legend className="sr-only">Equipment</legend>
            <div className="space-y-3">
              {EQUIPMENT_OPTIONS.map((eq) => (
                <ChoiceCard
                  key={eq}
                  type="checkbox"
                  name="equipment"
                  label={EQUIPMENT_LABELS[eq]}
                  checked={equipment.includes(eq)}
                  onChange={() => setEquipment(toggle(equipment, eq))}
                />
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-8">
            <legend className="mb-3 font-semibold">
              Are your joints feeling achy or sensitive at the moment?
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <ChoiceCard
                type="radio"
                name="joints"
                label="Yes, go gently"
                checked={sensitiveJoints}
                onChange={() => setSensitiveJoints(true)}
              />
              <ChoiceCard
                type="radio"
                name="joints"
                label="Not really"
                checked={!sensitiveJoints}
                onChange={() => setSensitiveJoints(false)}
              />
            </div>
          </fieldset>
          <Button className="mt-8" onClick={next}>
            Show my program
          </Button>
        </div>
      )}

      {step === "result" && chosen && (
        <div>
          <StepHeading
            title="Here's where we suggest you start"
            intro="Chosen from your answers. Every exercise has an easier and harder option where we have one, so it can grow with you."
          />
          <Card>
            <ProgramSummary program={chosen.program} />
            {chosen.missingEquipment.length > 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                This uses: {chosen.missingEquipment.join(", ")}. If that
                doesn&apos;t suit, pick one of the other programs below.
              </p>
            )}
          </Card>

          <Button className="mt-8 w-full sm:w-auto" onClick={startTrial}>
            {existing
              ? "Save and go to my dashboard"
              : `Start my ${TRIAL_LENGTH_DAYS}-day free trial`}
          </Button>
          {!existing && (
            <p className="mt-2 text-sm text-muted-foreground">
              No payment details needed.
            </p>
          )}

          {recommendations.length > 1 && (
            <fieldset className="mt-10">
              <legend className="mb-3 font-semibold">
                Or choose another program
              </legend>
              <div className="space-y-3">
                {recommendations.slice(0, 3).map((r) => (
                  <ChoiceCard
                    key={r.program.id}
                    type="radio"
                    name="program"
                    label={r.program.name}
                    hint={`${r.program.daysPerWeek} days a week · about ${r.program.sessionMinutes} minutes`}
                    checked={chosen.program.id === r.program.id}
                    onChange={() => setChosenId(r.program.id)}
                  />
                ))}
              </div>
            </fieldset>
          )}

          <p className="mt-10 text-xs text-muted-foreground">
            This program offers general exercise guidance and isn&apos;t a
            substitute for medical advice. Stop and rest if anything feels
            painful or wrong.
          </p>
        </div>
      )}
    </div>
  );
}
