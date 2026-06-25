"use client";

import type { Project } from "@/types/types";
import ProjectStatusBadge from "./ProjectStatusBadge";
import ProjectPriorityBadge from "./ProjectPriorityBadge";
import Button from "@/components/ui/Button";

type Props = {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
};

export default function ProjectCard({ project, onEdit, onDelete }: Props) {
  const formattedDueDate = project.due_date
    ? new Date(project.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      {/* Top row: name + status */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-card-foreground">{project.name}</h3>
          <p className="text-sm text-muted-foreground">{project.client_name}</p>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      {/* Description */}
      {project.description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
      )}

      {/* Priority + due date */}
      <div className="flex items-center gap-2">
        <ProjectPriorityBadge priority={project.priority} />
        {formattedDueDate && (
          <span className="text-xs text-muted-foreground">Due {formattedDueDate}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-border pt-3">
        <Button
          variant="ghost"
          className="flex-1"
          onClick={() => onEdit(project)}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          className="flex-1 text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(project)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
