"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useProject } from "@/hooks/projects/useProject";
import { useUpdateProject } from "@/hooks/projects/useUpdateProject";
import { useDeleteProject } from "@/hooks/projects/useDeleteProject";
import ProjectStatusBadge from "@/components/projects/ProjectStatusBadge";
import ProjectPriorityBadge from "@/components/projects/ProjectPriorityBadge";
import ProjectModal from "@/components/projects/ProjectModal";
import ProjectForm, { type FormValues } from "@/components/projects/ProjectForm";
import DeleteDialog from "@/components/projects/DeleteDialog";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: project, isPending, isError } = useProject(id);
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  function handleUpdate(values: FormValues) {
    updateProject(
      {
        id,
        ...values,
        description: values.description || null,
        start_date: values.start_date || null,
        due_date: values.due_date || null,
      },
      { onSuccess: () => setShowEditModal(false) },
    );
  }

  function handleDelete() {
    deleteProject(id, {
      onSuccess: () => router.push("/projects"),
    });
  }

  if (isPending) return <Spinner />;

  if (isError || !project) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-muted-foreground">Project not found.</p>
        <Link href="/projects" className="mt-4 inline-block text-sm text-primary hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const formattedDate = (dateStr: string | null) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Projects
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowEditModal(true)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteDialog(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">{project.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{project.client_name}</p>
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>

        {/* Description */}
        {project.description && (
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{project.description}</p>
        )}

        <hr className="my-6 border-border" />

        {/* Details grid */}
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Priority</dt>
            <dd className="mt-1">
              <ProjectPriorityBadge priority={project.priority} />
            </dd>
          </div>

          {formattedDate(project.start_date) && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Start Date</dt>
              <dd className="mt-1 text-sm text-card-foreground">{formattedDate(project.start_date)}</dd>
            </div>
          )}

          {formattedDate(project.due_date) && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Due Date</dt>
              <dd className="mt-1 text-sm text-card-foreground">{formattedDate(project.due_date)}</dd>
            </div>
          )}

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Last Updated</dt>
            <dd className="mt-1 text-sm text-card-foreground">{formattedDate(project.updated_at)}</dd>
          </div>
        </dl>
      </div>

      {showEditModal && (
        <ProjectModal title="Edit Project" onClose={() => setShowEditModal(false)}>
          <ProjectForm
            project={project}
            onSubmit={handleUpdate}
            onCancel={() => setShowEditModal(false)}
            isPending={isUpdating}
          />
        </ProjectModal>
      )}

      {showDeleteDialog && (
        <DeleteDialog
          project={project}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}
