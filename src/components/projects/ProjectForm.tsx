"use client";

import { useForm } from "react-hook-form";
import type { Project, ProjectStatus, ProjectPriority } from "@/types/types";
import Button from "@/components/ui/Button";

// Exported so ProjectList can use the same type for its handlers
export type FormValues = {
  name: string;
  client_name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date: string;
  due_date: string;
};

type Props = {
  project?: Project; // if provided → edit mode, otherwise → create mode
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isPending: boolean;
};

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const labelClass = "block text-sm font-medium text-foreground mb-1";

export default function ProjectForm({ project, onSubmit, onCancel, isPending }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: project?.name ?? "",
      client_name: project?.client_name ?? "",
      description: project?.description ?? "",
      status: project?.status ?? "PLANNING",
      priority: project?.priority ?? "MEDIUM",
      start_date: project?.start_date ?? "",
      due_date: project?.due_date ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Name */}
      <div>
        <label className={labelClass}>Project Name *</label>
        <input
          {...register("name", { required: "Project name is required" })}
          className={inputClass}
          placeholder="e.g. Website Redesign"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Client */}
      <div>
        <label className={labelClass}>Client Name *</label>
        <input
          {...register("client_name", { required: "Client name is required" })}
          className={inputClass}
          placeholder="e.g. Acme Corp"
        />
        {errors.client_name && (
          <p className="mt-1 text-xs text-destructive">{errors.client_name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className={inputClass}
          placeholder="Brief description of the project..."
        />
      </div>

      {/* Status + Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Status</label>
          <select {...register("status")} className={inputClass}>
            <option value="PLANNING">Planning</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Priority</label>
          <select {...register("priority")} className={inputClass}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Start Date</label>
          <input type="date" {...register("start_date")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Due Date</label>
          <input
            type="date"
            {...register("due_date", {
              validate: (value, formValues) => {
                if (value && formValues.start_date && value < formValues.start_date) {
                  return "Due date cannot be earlier than start date";
                }
              },
            })}
            className={inputClass}
          />
          {errors.due_date && (
            <p className="mt-1 text-xs text-destructive">{errors.due_date.message}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : project ? "Save Changes" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
