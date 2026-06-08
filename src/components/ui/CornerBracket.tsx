type CornerBracketProps = {
  className?: string;
  size?: "sm" | "md";
};

export function CornerBracket({ className = "", size = "md" }: CornerBracketProps) {
  const len = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  const stroke = size === "sm" ? "border-mutation/50" : "border-mutation/70";

  return (
    <span className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <span className={`absolute top-0 left-0 border-t border-l ${len} ${stroke}`} />
      <span className={`absolute top-0 right-0 border-t border-r ${len} ${stroke}`} />
      <span className={`absolute bottom-0 left-0 border-b border-l ${len} ${stroke}`} />
      <span className={`absolute right-0 bottom-0 border-r border-b ${len} ${stroke}`} />
    </span>
  );
}
