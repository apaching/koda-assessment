"use client";

import { useQuery } from "@tanstack/react-query";
import type { Project } from "../../types/types";

export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", "detail", id],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch project.");
      return data.data as Project;
    },
    enabled: !!id,
  });
}
