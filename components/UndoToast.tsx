"use client";

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
}

export default function UndoToast({ message, onUndo, onDismiss }: UndoToastProps) {
  return (
    <div className="pointer-events-auto flex items-center justify-between gap-3 rounded-xl border border-saffron-300 bg-white px-4 py-2.5 shadow-lg">
      <span className="text-sm text-gray-800">{message}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onUndo}
          className="text-sm font-semibold uppercase tracking-wide text-saffron-600 hover:text-saffron-700 active:scale-95"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="text-gray-400 active:scale-95"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
