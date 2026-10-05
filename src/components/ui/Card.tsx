import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-slate-800 bg-slate-900/90 p-6 text-white shadow-xl backdrop-blur-sm transition-all hover:border-amber-500/30",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";
