import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "emerald" | "outline" | "ghost" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon" | "xl";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer select-none",
          {
            "bg-emerald-500 text-emerald-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20":
              variant === "emerald" || variant === "default",
            "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700":
              variant === "secondary",
            "border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800/60 hover:text-white":
              variant === "outline",
            "hover:bg-slate-800/50 hover:text-slate-100 text-slate-300":
              variant === "ghost",
            "bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-600/20":
              variant === "destructive",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-8 rounded-lg px-3 text-xs": size === "sm",
            "h-12 rounded-xl px-6 text-base font-bold": size === "lg",
            "h-14 rounded-2xl px-8 text-lg font-black tracking-wide": size === "xl",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
