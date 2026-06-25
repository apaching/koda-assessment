import type { ProjectPriority } from "@/types/types";

const config: Record<ProjectPriority, { label: string; className: string }> = {
  LOW: { label: "Low", className: "bg-gray-100 text-gray-500" },
  MEDIUM: { label: "Medium", className: "bg-yellow-100 text-yellow-700" },
  HIGH: { label: "High", className: "bg-red-100 text-red-700" },
};

export default function ProjectPriorityBadge({ priority }: { priority: ProjectPriority }) {
  const { label, className } = config[priority];
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
