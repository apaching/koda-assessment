"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Project, ProjectInsert } from "../../types/types";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: Omit<ProjectInsert, "user_id">) => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project.");
      return data.data as Project;
    },
    onSuccess: (newProject) => {
      queryClient.setQueriesData<Project[]>(
        { queryKey: ["projects", "list"] },
        (old = []) => [newProject, ...old],
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", "list"] });
    },
  });
}
