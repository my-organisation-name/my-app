import { HomeAuthStatus } from "@/components/auth/HomeAuthStatus";
import { APP_NAME, ButtonLink, Card } from "@/components/ui";

const PROMISES = [
  {
    title: "Start exactly where you are",
    body: "New to exercise, getting back into it, or already active: every program has a gentle way in and room to grow.",
  },
  {
    title: "Built for the menopause years",
    body: "Made with women in their menopause years in mind, with core and pelvic floor strength and joint-friendly options built in.",
  },
  {
    title: "Short, doable sessions",
    body: "15 to 45 minutes at home, with little or no equipment. Easier and harder options on the exercises that have them.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-6 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium tracking-wide text-primary uppercase">
            {APP_NAME}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Feel stronger, steadier and more capable through menopause and
            beyond.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A warm, judgement-free strength program for women in midlife,
            grounded in the evidence on building and keeping muscle and bone.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="/start">Start your free trial</ButtonLink>
            <HomeAuthStatus />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            A few gentle questions, then your program. No payment details
            needed.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {PROMISES.map((p) => (
            <Card key={p.title}>
              <h2 className="text-lg font-bold">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
