import { CornerBracket } from "./CornerBracket";

type PanelFrameProps = {
  children: React.ReactNode;
  className?: string;
};

export function PanelFrame({ children, className = "" }: PanelFrameProps) {
  return (
    <div className={`panel-frame relative ${className}`}>
      <CornerBracket size="sm" />
      {children}
    </div>
  );
}
