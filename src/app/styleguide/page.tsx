type ColorToken = {
  name: string;
  swatchClassName: string;
  cssVar: string;
};

const colorTokens: ColorToken[] = [
  { name: "Background", swatchClassName: "bg-background text-foreground border border-border", cssVar: "--color-background" },
  { name: "Foreground", swatchClassName: "bg-foreground text-background", cssVar: "--color-foreground" },
  { name: "Card", swatchClassName: "bg-card text-card-foreground border border-border", cssVar: "--color-card" },
  { name: "Primary", swatchClassName: "bg-primary text-primary-foreground", cssVar: "--color-primary" },
  { name: "Secondary", swatchClassName: "bg-secondary text-secondary-foreground", cssVar: "--color-secondary" },
  { name: "Accent", swatchClassName: "bg-accent text-accent-foreground", cssVar: "--color-accent" },
  { name: "Muted", swatchClassName: "bg-muted text-muted-foreground", cssVar: "--color-muted" },
  { name: "Success", swatchClassName: "bg-success text-success-foreground", cssVar: "--color-success" },
  { name: "Warning", swatchClassName: "bg-warning text-warning-foreground", cssVar: "--color-warning" },
  { name: "Error", swatchClassName: "bg-error text-error-foreground", cssVar: "--color-error" },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border py-10 first:border-t-0 first:pt-0 sm:py-14">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function ColorSwatch({ token }: { token: ColorToken }) {
  return (
    <div>
      <div
        className={`flex h-20 items-end rounded-2xl p-3 text-sm font-medium sm:h-24 ${token.swatchClassName}`}
      >
        {token.name}
      </div>
      <p className="mt-2 font-mono text-xs text-muted-foreground">{token.cssVar}</p>
    </div>
  );
}

function PrimaryButton(props: React.ComponentProps<"button">) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
    />
  );
}

function SecondaryButton(props: React.ComponentProps<"button">) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center rounded-full border border-border bg-secondary px-6 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
    />
  );
}

function OutlineButton(props: React.ComponentProps<"button">) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center rounded-full border border-primary bg-transparent px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
    />
  );
}

function GhostButton(props: React.ComponentProps<"button">) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
    />
  );
}

function Badge({
  tone,
  children,
}: {
  tone: "success" | "warning" | "error" | "accent";
  children: React.ReactNode;
}) {
  const toneClassName: Record<typeof tone, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    accent: "bg-accent/10 text-accent",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClassName[tone]}`}
    >
      {children}
    </span>
  );
}

function Card({ title, description, badge }: { title: string; description: string; badge: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm shadow-foreground/5">
      <Badge tone="accent">{badge}</Badge>
      <h3 className="mt-4 text-lg font-bold text-card-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
      <header className="mb-10 sm:mb-14">
        <p className="font-mono text-xs font-medium tracking-wide text-primary uppercase">
          Design system
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          Styleguide
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          The colors, type, and components this app is built from — clean and
          fresh, never abrasive, generously rounded, and responsive from
          mobile through desktop.
        </p>
      </header>

      <Section
        title="Color"
        description="Semantic tokens defined as CSS variables in globals.css, each with a light and dark value. Use the Tailwind utilities (bg-primary, text-foreground, border-border, …) rather than hardcoded hex values."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {colorTokens.map((token) => (
            <ColorSwatch key={token.name} token={token} />
          ))}
        </div>
      </Section>

      <Section
        title="Typography"
        description="Plus Jakarta Sans for interface text, JetBrains Mono for code and labels."
      >
        <div className="space-y-5">
          <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Display heading
          </p>
          <p className="text-3xl font-bold tracking-tight sm:text-4xl">
            Heading 1
          </p>
          <p className="text-2xl font-bold sm:text-3xl">Heading 2</p>
          <p className="text-xl font-semibold sm:text-2xl">Heading 3</p>
          <p className="max-w-2xl text-base text-foreground sm:text-lg">
            Body text sits at a comfortable reading size with generous line
            height, so paragraphs stay easy to scan on any screen size.
          </p>
          <p className="text-sm text-muted-foreground">
            Small / muted text for captions and secondary details.
          </p>
          <p className="font-mono text-sm text-muted-foreground">
            const token = &quot;--font-mono&quot;;
          </p>
        </div>
      </Section>

      <Section title="Buttons" description="Fully rounded, three weights plus a quiet ghost variant.">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <PrimaryButton>Primary</PrimaryButton>
          <SecondaryButton>Secondary</SecondaryButton>
          <OutlineButton>Outline</OutlineButton>
          <GhostButton>Ghost</GhostButton>
          <PrimaryButton disabled>Disabled</PrimaryButton>
        </div>
      </Section>

      <Section title="Badges" description="Soft, tinted backgrounds instead of solid fills keep status colors calm.">
        <div className="flex flex-wrap gap-3">
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="error">Error</Badge>
          <Badge tone="accent">Accent</Badge>
        </div>
      </Section>

      <Section title="Form elements" description="Rounded corners and a soft focus ring throughout.">
        <div className="grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-medium sm:col-span-2">
            Email
            <input
              type="email"
              placeholder="you@example.com"
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium sm:col-span-2">
            Message
            <textarea
              rows={3}
              placeholder="Say something nice"
              className="resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Plan
            <select className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none focus:ring-2 focus:ring-primary/40">
              <option>Free</option>
              <option>Pro</option>
              <option>Team</option>
            </select>
          </label>
          <label className="flex items-center gap-2 self-end pb-2.5 text-sm font-medium">
            <input type="checkbox" className="h-4 w-4 rounded accent-primary" defaultChecked />
            Remember me
          </label>
        </div>
      </Section>

      <Section title="Cards" description="Responsive grid — one column on mobile, up to three on desktop.">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Fresh by default"
            badge="Color"
            description="A soft teal primary and violet accent on warm neutrals, never a stark black or a harsh pure red."
          />
          <Card
            title="Rounded everywhere"
            badge="Shape"
            description="Cards, buttons, inputs, and badges all share the same generous corner radius for a cohesive feel."
          />
          <Card
            title="Built for every screen"
            badge="Layout"
            description="Every section here reflows from a single column on mobile to a multi-column grid on iPad and desktop widths."
          />
        </div>
      </Section>
    </div>
  );
}
