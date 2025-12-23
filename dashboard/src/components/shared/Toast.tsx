import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";

export type ToastType = "success" | "error" | "warning";

interface ToastProps {
  open: boolean;
  type?: ToastType;
  message: string;
  onOpenChange: (open: boolean) => void;
  duration?: number; // ms
}

const typeVars: Record<ToastType, string> = {
  success:
    "var(--toast-success-bg, #e6f9ed) var(--toast-success-text, #15803d) var(--toast-success-border, #22c55e)",
  error:
    "var(--toast-error-bg, #fef2f2) var(--toast-error-text, #b91c1c) var(--toast-error-border, #ef4444)",
  warning:
    "var(--toast-warning-bg, #fef9c3) var(--toast-warning-text, #b45309) var(--toast-warning-border, #facc15)",
};

export const Toast: React.FC<ToastProps> = ({
  open,
  type = "success",
  message,
  onOpenChange,
  duration = 3000,
}) => {
  const [bg, text, border] = typeVars[type].split(" ");

  return (
    <ToastPrimitive.Provider swipeDirection="right" duration={duration}>
      <ToastPrimitive.Root
        open={open}
        onOpenChange={onOpenChange}
        className="fixed top-15 right-8 z-50 min-w-60 max-w-xs px-4 py-3 rounded shadow-lg border-l-4 flex items-center gap-2 animate-fade-in"
        style={{
          background: bg,
          color: text,
          borderColor: border,
        }}
      >
        {type === "success" && (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {type === "error" && (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
        {type === "warning" && (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.918-.816 1.995-1.85l.007-.15V6c0-1.054-.816-1.918-1.85-1.995L19.856 4H6.144C5.09 4 4.226 4.816 4.15 5.85L4.143 6v12c0 1.054.816 1.918 1.85 1.995l.15.005z"
            />
          </svg>
        )}
        <span className="flex-1">{message}</span>
        <ToastPrimitive.Close asChild>
          <button
            className="ml-2 text-lg text-gray-500 hover:text-gray-800 focus:outline-none"
            aria-label="Fechar"
          >
            &times;
          </button>
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="fixed bottom-6 right-6 z-50" />
    </ToastPrimitive.Provider>
  );
};
