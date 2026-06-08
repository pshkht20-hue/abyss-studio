type BtnGlowProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function BtnGlow({ href, children, className = "" }: BtnGlowProps) {
  return (
    <a href={href} className={`btn-glow inline-block px-8 py-4 ${className}`}>
      {children}
    </a>
  );
}
