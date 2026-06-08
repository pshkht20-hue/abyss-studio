import { Prism3D } from "./Prism3D";

type SectionPrismAccentProps = {
  variant?: "cube" | "diamond";
  size?: string;
  spinDuration?: number;
  className?: string;
};

export function SectionPrismAccent({
  variant = "cube",
  size = "28px",
  spinDuration = 20,
  className = "",
}: SectionPrismAccentProps) {
  return (
    <div className={`section-prism-accent hidden md:block ${className}`} aria-hidden>
      <Prism3D size={size} variant={variant} spinDuration={spinDuration} />
    </div>
  );
}
