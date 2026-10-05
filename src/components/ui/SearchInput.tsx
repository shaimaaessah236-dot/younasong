import * as React from "react";
import { Input, InputProps } from "./Input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <Input
          ref={ref}
          type="search"
          placeholder="ابحث عن شارة، كلمات أغنية، أنمي، أو مغني..."
          className={cn("ps-10 pe-4", className)}
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";
