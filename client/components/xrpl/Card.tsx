import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
  highlight?: boolean;
}

export function Card({
  title,
  children,
  className = "",
  highlight = false,
}: CardProps) {
  return (
    <div
      className={`relative rounded-xl border backdrop-blur-sm transition-all duration-300 ${
        highlight
          ? "border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
          : "border-slate-700/50 bg-slate-800/40 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
      } ${className}`}
    >
      {/* Tech decoration line */}
      {highlight && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      )}

      {/* Header */}
      <div className="border-b border-slate-700/30 px-6 py-4">
        <h3 className="text-sm font-semibold tracking-widest text-slate-200 uppercase">
          {title}
        </h3>
      </div>

      {/* Content */}
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}
