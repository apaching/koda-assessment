"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { EllipsisVertical } from "lucide-react";
import type { Project, ProjectStatus, ProjectPriority } from "@/types/types";

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  PLANNING: { label: "Planning", className: "bg-blue-100 text-blue-700" },
  IN_PROGRESS: { label: "In Progress", className: "bg-amber-100 text-amber-700" },
  ON_HOLD: { label: "On Hold", className: "bg-gray-100 text-gray-600" },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700" },
};

const priorityConfig: Record<ProjectPriority, { label: string; className: string }> = {
  LOW: { label: "Low", className: "bg-gray-100 text-gray-500" },
  MEDIUM: { label: "Medium", className: "bg-yellow-100 text-yellow-700" },
  HIGH: { label: "High", className: "bg-red-100 text-red-700" },
};

type Props = {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
};

export default function ProjectCard({ project, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const formattedDueDate = project.due_date
    ? new Date(project.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="relative rounded-xl border border-border bg-card shadow-sm">
      {/* Kebab menu — sits above the link */}
      <div ref={menuRef} className="absolute right-3 top-3 z-10">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Project options"
        >
          <EllipsisVertical size={15} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-8 min-w-30 rounded-lg border border-border bg-card py-1 shadow-lg">
            <button
              className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-accent transition-colors"
              onClick={() => { setMenuOpen(false); onEdit(project); }}
            >
              Edit
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors"
              onClick={() => { setMenuOpen(false); onDelete(project); }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Clickable card area */}
      <Link
        href={`/projects/${project.id}`}
        className="flex flex-col gap-3 p-4 rounded-xl hover:bg-accent/50 transition-colors"
      >
        {/* Name + chips */}
        <div className="pr-6">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-semibold leading-snug text-card-foreground">{project.name}</h3>
            <span className={`rounded-full px-1.5 py-px text-[10px] font-medium ${statusConfig[project.status].className}`}>
              {statusConfig[project.status].label}
            </span>
            <span className={`rounded-full px-1.5 py-px text-[10px] font-medium ${priorityConfig[project.priority].className}`}>
              {priorityConfig[project.priority].label}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{project.client_name}</p>
        </div>

        {/* Description */}
        {project.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
        )}

        {/* Due date */}
        {formattedDueDate && (
          <p className="text-xs text-muted-foreground">Due {formattedDueDate}</p>
        )}
      </Link>
    </div>
  );
}
