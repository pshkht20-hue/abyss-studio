"use client";

type Prism3DProps = {
  size?: string;
  spinDuration?: number;
  spin?: boolean;
  variant?: "cube" | "diamond";
  className?: string;
};

export function Prism3D({
  size = "1.65em",
  spinDuration = 24,
  spin = true,
  variant = "cube",
  className = "",
}: Prism3DProps) {
  const style = {
    "--prism-size": size,
    "--prism-spin": `${spinDuration}s`,
  } as React.CSSProperties;

  if (variant === "diamond") {
    return (
      <div
        className={`prism-3d prism-3d--diamond ${spin ? "prism-3d--spin" : ""} ${className}`}
        style={style}
        aria-hidden
      >
        <div className="prism-diamond">
          <span className="prism-diamond-face prism-diamond-face--top" />
          <span className="prism-diamond-face prism-diamond-face--bottom" />
          <span className="prism-diamond-face prism-diamond-face--left" />
          <span className="prism-diamond-face prism-diamond-face--right" />
          <span className="prism-diamond-face prism-diamond-face--front" />
          <span className="prism-diamond-face prism-diamond-face--back" />
          <span className="prism-diamond-core" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`prism-3d prism-3d--cube ${spin ? "prism-3d--spin" : ""} ${className}`}
      style={style}
      aria-hidden
    >
      <div className="prism-cube">
        <span className="prism-cube-face prism-cube-face--front" />
        <span className="prism-cube-face prism-cube-face--back" />
        <span className="prism-cube-face prism-cube-face--right" />
        <span className="prism-cube-face prism-cube-face--left" />
        <span className="prism-cube-face prism-cube-face--top" />
        <span className="prism-cube-face prism-cube-face--bottom" />
        <span className="prism-cube-core" />
      </div>
    </div>
  );
}
