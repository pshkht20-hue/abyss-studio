type SectionWatermarkProps = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
};

export function SectionWatermark({ children, className = "", ...rest }: SectionWatermarkProps) {
  return (
    <span
      className={`section-watermark pointer-events-none absolute select-none ${className}`}
      aria-hidden
      {...rest}
    >
      {children}
    </span>
  );
}
