import Link from "next/link";

/** Working product name — change it here once the brand is settled. */
export const APP_NAME = "Midlife Strong";

const primary =
  "inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40";
const secondary =
  "inline-flex items-center justify-center rounded-full border border-border bg-secondary px-6 py-3 text-base font-semibold text-secondary-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40";
const ghost =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40";

const variants = { primary, secondary, ghost };
type Variant = keyof typeof variants;

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      type="button"
      {...props}
      className={`${variants[variant]} ${className}`}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: React.ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link {...props} className={`${variants[variant]} ${className}`} />;
}

export function Card({
  className = "",
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={`rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm shadow-foreground/5 ${className}`}
    />
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
      {children}
    </span>
  );
}

/** A large, tappable radio or checkbox option. */
export function ChoiceCard({
  type,
  name,
  checked,
  onChange,
  label,
  hint,
}: {
  type: "radio" | "checkbox";
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
        checked
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:bg-muted"
      }`}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 accent-primary"
      />
      <span>
        <span className="block font-semibold">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-sm text-muted-foreground">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}

/** A soft, tinted message box for gentle guidance. */
export function Note({
  tone,
  children,
}: {
  tone: "warning" | "accent";
  children: React.ReactNode;
}) {
  const toneClassName = {
    warning: "border-warning/40 bg-warning/10",
    accent: "border-accent/40 bg-accent/10",
  };
  return (
    <div
      role="note"
      className={`rounded-2xl border p-5 text-card-foreground ${toneClassName[tone]}`}
    >
      {children}
    </div>
  );
}
