import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "default";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = "danger",
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const variantStyles = {
    danger: {
      icon: "text-red-600",
      button: "bg-red-600 hover:bg-red-700 disabled:bg-red-400",
    },
    warning: {
      icon: "text-yellow-600",
      button: "bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400",
    },
    default: {
      icon: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none">
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center ${styles.icon}`}
            >
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-600 mb-6">
                {description}
              </Dialog.Description>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:cursor-not-allowed ${styles.button}`}
                >
                  {isLoading ? "Processando..." : confirmLabel}
                </button>
              </div>
            </div>
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
