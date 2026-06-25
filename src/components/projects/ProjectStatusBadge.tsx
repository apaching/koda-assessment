import type { ProjectStatus } from "@/types/types";

const config: Record<ProjectStatus, { label: string; className: string }> = {
  PLANNING: { label: "Planning", className: "bg-blue-100 text-blue-700" },
  IN_PROGRESS: { label: "In Progress", className: "bg-amber-100 text-amber-700" },
  ON_HOLD: { label: "On Hold", className: "bg-gray-100 text-gray-600" },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700" },
};

export default function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
