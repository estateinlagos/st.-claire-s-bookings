import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Placeholder for a photograph that must be supplied by the business.
 * No stock or fabricated imagery is used anywhere on this site.
 */
export function ImageSlot({
  label,
  className,
  ratio = "aspect-[4/5]",
}: {
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-dashed border-border bg-secondary p-4 text-center",
        ratio,
        className,
      )}
      role="img"
      aria-label={`Awaiting approved photo: ${label}`}
    >
      <ImageIcon className="size-5 text-muted-foreground" aria-hidden />
      <p className="text-[0.7rem] leading-snug tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="text-[0.65rem] text-muted-foreground/70">
        Awaiting approved photo
      </p>
    </div>
  );
}

export function Tbc({ children }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-[0.65rem] font-medium tracking-wider text-accent-foreground uppercase">
      {children ?? "To be confirmed"}
    </span>
  );
}
