import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen = true,
  onClose,
  title,
  children,
  className,
  overlayClassName,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200",
        overlayClassName
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-2xl transition-all animate-in zoom-in-95 duration-200",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          {title && <h3 className="text-lg font-semibold text-amber-400">{title}</h3>}
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ms-auto cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export const Dialog = Modal;
