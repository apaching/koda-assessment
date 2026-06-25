"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Project } from "../../types/types";

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete project.");
    },
    onSuccess: (_data, id) => {
      queryClient.setQueriesData<Project[]>(
        { queryKey: ["projects", "list"] },
        (old = []) => old.filter((p) => p.id !== id),
      );
      queryClient.removeQueries({ queryKey: ["projects", "detail", id] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", "list"] });
    },
  });
}
