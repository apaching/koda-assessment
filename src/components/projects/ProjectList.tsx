"use client";

import { useState } from "react";
import type { Project } from "@/types/types";
import { useProjects } from "@/hooks/projects/useProjects";
import { useCreateProject } from "@/hooks/projects/useCreateProject";
import { useUpdateProject } from "@/hooks/projects/useUpdateProject";
import { useDeleteProject } from "@/hooks/projects/useDeleteProject";
import ProjectCard from "./ProjectCard";
import ProjectForm, { type FormValues } from "./ProjectForm";
import ProjectModal from "./ProjectModal";
import DeleteDialog from "./DeleteDialog";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";

export default function ProjectList() {
  // Which modal is open
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  // Data + mutations
  const { data: projects, isPending, isError } = useProjects();
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  function handleCreate(values: FormValues) {
    createProject(
      {
        ...values,
        // Convert empty strings to null for optional fields
        description: values.description || null,
        start_date: values.start_date || null,
        due_date: values.due_date || null,
      },
      { onSuccess: () => setShowCreateModal(false) },
    );
  }

  function handleUpdate(values: FormValues) {
    if (!editingProject) return;
    updateProject(
      {
        id: editingProject.id,
        ...values,
        description: values.description || null,
        start_date: values.start_date || null,
        due_date: values.due_date || null,
      },
      { onSuccess: () => setEditingProject(null) },
    );
  }

  function handleDelete() {
    if (!deletingProject) return;
    deleteProject(deletingProject.id, {
      onSuccess: () => setDeletingProject(null),
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Projects</h1>
          {/* Button hidden on mobile — FAB handles it instead */}
          <Button
            className="hidden sm:inline-flex"
            onClick={() => setShowCreateModal(true)}
          >
            + New Project
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {isPending && <Spinner />}

        {isError && (
          <p className="py-8 text-center text-sm text-destructive">
            Failed to load projects. Please refresh the page.
          </p>
        )}

        {!isPending && !isError && projects?.length === 0 && (
          <EmptyState message="No projects yet. Tap + to create your first one." />
        )}

        {!isPending && !isError && projects && projects.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={setEditingProject}
                onDelete={setDeletingProject}
              />
            ))}
          </div>
        )}
      </main>

      {/* Mobile FAB — hidden on sm+ screens where the header button shows */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground shadow-lg sm:hidden"
        aria-label="New project"
      >
        +
      </button>

      {/* Create modal */}
      {showCreateModal && (
        <ProjectModal title="New Project" onClose={() => setShowCreateModal(false)}>
          <ProjectForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateModal(false)}
            isPending={isCreating}
          />
        </ProjectModal>
      )}

      {/* Edit modal */}
      {editingProject && (
        <ProjectModal title="Edit Project" onClose={() => setEditingProject(null)}>
          <ProjectForm
            project={editingProject}
            onSubmit={handleUpdate}
            onCancel={() => setEditingProject(null)}
            isPending={isUpdating}
          />
        </ProjectModal>
      )}

      {/* Delete confirmation */}
      {deletingProject && (
        <DeleteDialog
          project={deletingProject}
          onConfirm={handleDelete}
          onCancel={() => setDeletingProject(null)}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}
