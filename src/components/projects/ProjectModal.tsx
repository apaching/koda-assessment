"use client";

type Props = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function ProjectModal({ title, onClose, children }: Props) {
  return (
    // Full-screen overlay
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop — clicking it closes the modal */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel — slides up from bottom on mobile, centered on desktop */}
      <div className="relative w-full sm:max-w-lg bg-card rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
