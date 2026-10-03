import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "emerald" | "cyan" | "outline" | "destructive" | "amber";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-slate-800 text-slate-200": variant === "default",
          "border-transparent bg-emerald-500/15 text-emerald-400 border border-emerald-500/30":
            variant === "emerald",
          "border-transparent bg-cyan-500/15 text-cyan-400 border border-cyan-500/30":
            variant === "cyan",
          "border-transparent bg-amber-500/15 text-amber-400 border border-amber-500/30":
            variant === "amber",
          "border-transparent bg-rose-500/15 text-rose-400 border border-rose-500/30":
            variant === "destructive",
          "border border-slate-700 text-slate-300": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
