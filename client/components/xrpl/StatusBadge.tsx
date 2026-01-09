interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isProcessing = status === "Processing...";
  const isError = status.startsWith("Error");

  const bgColor = isError
    ? "bg-red-500/10"
    : isProcessing
      ? "bg-yellow-500/10"
      : "bg-emerald-500/10";

  const textColor = isError
    ? "text-red-400"
    : isProcessing
      ? "text-yellow-400"
      : "text-emerald-400";

  const borderColor = isError
    ? "border-red-500/20"
    : isProcessing
      ? "border-yellow-500/20"
      : "border-emerald-500/20";

  return (
    <div
      className={`px-3 py-1.5 rounded-full border text-xs font-medium ${bgColor} ${textColor} ${borderColor} inline-flex items-center gap-2 w-fit`}
    >
      {isProcessing && (
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
      )}
      {isError && <div className="w-1.5 h-1.5 rounded-full bg-red-400" />}
      {!isError && !isProcessing && (
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      )}
      {status || "Ready"}
    </div>
  );
}
