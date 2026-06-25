"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Project, ProjectUpdate } from "../../types/types";

export interface UpdateProjectPayload extends ProjectUpdate {
  id: string;
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...body }: UpdateProjectPayload) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update project.");
      return data.data as Project;
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueriesData<Project[]>(
        { queryKey: ["projects", "list"] },
        (old = []) => old.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
      );
      queryClient.setQueryData<Project>(
        ["projects", "detail", updatedProject.id],
        updatedProject,
      );
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["projects", "list"] });
      queryClient.invalidateQueries({ queryKey: ["projects", "detail", id] });
    },
  });
}
