# Program content: notes for review

The exercise library and programs live in `src/data/exercises.json` and
`src/data/programs.json`, exactly as supplied. Edit those files to change
content; no code changes are needed.

Items below were added in code on top of the supplied data and should be
checked by the program's exercise professional.

## 1. Easier / harder swaps (proposed)

Defined in `src/lib/program/ladders.ts`:

| Exercise | Easier | Harder |
|---|---|---|
| Sit to Stand | — | Bodyweight Squat |
| Bodyweight Squat | Sit to Stand | Reverse Lunge |
| Reverse Lunge | Bodyweight Squat | — |
| Step-Up | Sit to Stand | — |
| Wall Push-Up | — | Knee Push-Up |
| Knee Push-Up | Wall Push-Up | Standard Push-Up |
| Standard Push-Up | Knee Push-Up | — |
| Modified Plank (Knees) | — | Plank Hold |
| Plank Hold | Modified Plank (Knees) | — |
| Superman Hold | Bird Dog | — |
| Wall Angels | — | Overhead Press (Light Dumbbell) |
| Overhead Press (Light Dumbbell) | Wall Angels | — |

Exercises without a swap show a "do fewer reps / slow it down" suggestion
instead. The whole **New Start — Core & Pelvic Floor** program currently has
no swaps.

## 2. Health check wording

Plain-language versions of the seven general PAR-Q+ questions, plus a
pelvic-floor symptom question that suggests a women's health
physiotherapist. See `HEALTH_QUESTIONS` in
`src/components/onboarding/Onboarding.tsx`. Any "yes" to the seven
questions shows a GP note and limits recommendations to beginner programs.

## 3. Program matching

`src/lib/program/placement.ts` picks a starting program from: experience
(new / returning / regular), focus, days and minutes available, equipment
at home, and joint sensitivity.

## 4. Gaps in the current content

- **Load progression.** Nearly everything is bodyweight. The research on
  muscle and bone in the menopause years (e.g. the LIFTMOR trial) favours
  progressively heavier resistance, so dumbbell and band versions of the
  squat, hinge (e.g. Romanian deadlift) and row would be good additions.
- **Pulling exercises.** Only Seated Row (Band) exists, and it isn't in the
  beginner full-body program. Guidelines call for all major muscle groups.
- **Hinge pattern.** Glute Bridge is the only hip-hinge exercise and has no
  harder version (e.g. single-leg bridge, dumbbell deadlift).
- **Bone loading.** Nothing for bone-loading impact (e.g. heel drops, small
  jumps) for those it suits.
- **Progression rules.** Programs have fixed sets and reps. The app currently
  suggests trying a harder option after two sessions rated "comfortable".
  A clear rule from the professional (e.g. add reps up to X, then move up a
  step) would make this more precise.
