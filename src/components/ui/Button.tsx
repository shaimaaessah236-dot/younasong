import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-amber-500 text-black hover:bg-amber-400 font-bold shadow-md",
      secondary: "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700",
      outline: "border border-amber-500 text-amber-500 hover:bg-amber-500/10",
      ghost: "text-slate-300 hover:text-white hover:bg-white/5",
      danger: "bg-red-600 text-white hover:bg-red-500",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-md",
      md: "h-10 px-5 text-sm rounded-lg",
      lg: "h-12 px-7 text-base rounded-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
