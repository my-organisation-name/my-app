import { getProgramExercises } from "@/lib/program/data";
import type { Program } from "@/lib/program/types";
import { Badge } from "@/components/ui";

const LEVEL_LABEL = {
  beginner: "Gentle start",
  active: "Building on what you do",
} as const;

export function ProgramSummary({
  program,
  showExercises = true,
}: {
  program: Program;
  showExercises?: boolean;
}) {
  return (
    <div>
      <Badge>{LEVEL_LABEL[program.difficulty]}</Badge>
      <h3 className="mt-3 text-xl font-bold">{program.name}</h3>
      <p className="mt-1 text-muted-foreground">{program.description}</p>
      <p className="mt-3 text-sm font-medium">
        {program.daysPerWeek} days a week · about {program.sessionMinutes}{" "}
        minutes
      </p>
      {showExercises && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {getProgramExercises(program).map((e) => (
            <li
              key={e.id}
              className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
            >
              {e.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
