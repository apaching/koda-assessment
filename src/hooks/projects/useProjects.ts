"use client";

import { useQuery } from "@tanstack/react-query";
import type { Project, ProjectStatus, ProjectPriority } from "../../types/types";

export interface ProjectFilters {
  status?: ProjectStatus;
  priority?: ProjectPriority;
  client_name?: string;
  search?: string;
}

export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: ["projects", "list", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.priority) params.set("priority", filters.priority);
      if (filters.client_name) params.set("client_name", filters.client_name);
      if (filters.search) params.set("search", filters.search);

      const res = await fetch(`/api/projects?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch projects.");
      return data.data as Project[];
    },
  });
}
