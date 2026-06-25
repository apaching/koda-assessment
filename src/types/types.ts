import { Enums, Tables, TablesInsert, TablesUpdate } from "./supabase";

// Row types
export type Project = Tables<"projects">;

// Insert / Update types
export type ProjectInsert = TablesInsert<"projects">;
export type ProjectUpdate = TablesUpdate<"projects">;

// Enum types
export type ProjectStatus = Enums<"project_status">;
export type ProjectPriority = Enums<"project_priority">;
