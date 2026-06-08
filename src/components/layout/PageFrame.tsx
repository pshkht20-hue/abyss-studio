export function PageFrame() {
  return (
    <div className="page-frame pointer-events-none fixed inset-0 z-[35]" aria-hidden>
      <span className="page-frame-corner page-frame-corner--tl" />
      <span className="page-frame-corner page-frame-corner--tr" />
      <span className="page-frame-corner page-frame-corner--bl" />
      <span className="page-frame-corner page-frame-corner--br" />
    </div>
  );
}
