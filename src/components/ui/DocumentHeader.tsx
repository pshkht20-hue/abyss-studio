type DocumentHeaderProps = {
  docId?: string;
  status?: string;
  filed?: string;
  revised?: string;
};

export function DocumentHeader({
  docId = "SYS/001",
  status = "Active",
  filed = "Q1 2026",
  revised = "Jun 2026",
}: DocumentHeaderProps) {
  return (
    <div className="doc-header mx-auto mb-10 max-w-7xl border-b border-hairline pb-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:items-center">
        <p className="type-meta text-bone/50">{docId} · Build brief</p>
        <p className="flex items-center type-meta text-bone/50">
          <span
            className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-mutation"
            aria-hidden
          />
          {status}
        </p>
        <p className="type-meta text-bone/50 max-md:hidden md:block">First filed · {filed}</p>
        <p className="text-right type-meta text-bone/50 max-md:hidden md:block">Revised · {revised}</p>
      </div>
    </div>
  );
}
