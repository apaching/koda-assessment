"use client";

import type { Project } from "@/types/types";
import Button from "@/components/ui/Button";

type Props = {
  project: Project;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
};

export default function DeleteDialog({ project, onConfirm, onCancel, isPending }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative mx-4 w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-card-foreground">Delete Project</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <strong className="text-foreground">{project.name}</strong>? This
          cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
