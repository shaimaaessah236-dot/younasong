import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "accent" | "neutral" | "success" | "danger";
  className?: string;
  children?: React.ReactNode;
}

export const Badge = ({ className, variant = "accent", ...props }: BadgeProps) => {
  const variants = {
    accent: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    neutral: "bg-slate-800 text-slate-300 border-slate-700",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    danger: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold backdrop-blur-md",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
