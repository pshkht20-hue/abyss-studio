type MonoLabelProps = {
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
};

export function MonoLabel({ children, accent = false, className = "" }: MonoLabelProps) {
  return (
    <span
      className={`mono-label inline-flex items-center gap-2 ${accent ? "text-mutation" : "text-mute"} ${className}`}
    >
      <span className="signal-dot" aria-hidden />
      {children}
    </span>
  );
}
