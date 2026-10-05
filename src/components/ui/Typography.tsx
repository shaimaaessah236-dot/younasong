import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  children?: React.ReactNode;
}

export const Typography = ({ as: Component = "p", className, children, ...props }: TypographyProps) => {
  const styles = {
    h1: "text-3xl sm:text-4xl font-extrabold tracking-tight text-white",
    h2: "text-2xl font-bold text-amber-400",
    h3: "text-xl font-semibold text-white",
    h4: "text-lg font-medium text-slate-200",
    p: "text-sm text-slate-400 leading-relaxed",
    span: "text-xs text-slate-500",
  };

  return (
    <Component className={cn(styles[Component], className)} {...props}>
      {children}
    </Component>
  );
};
