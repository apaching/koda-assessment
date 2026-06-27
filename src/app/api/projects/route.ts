import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";
import type { ProjectInsert, ProjectStatus, ProjectPriority } from "../../../types/types";

export async function GET(request: Request) {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status") as ProjectStatus | null;
  const priority = searchParams.get("priority") as ProjectPriority | null;
  const client_name = searchParams.get("client_name");
  const search = searchParams.get("search");

  let query = supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (client_name) query = query.ilike("client_name", `%${client_name}%`);
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: Omit<ProjectInsert, "user_id"> = await request.json();
  const { name, client_name, description, status, priority, start_date, due_date } = body;

  if (due_date && start_date && due_date < start_date) {
    return NextResponse.json({ error: "Due date cannot be earlier than start date" }, { status: 422 });
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({ name, client_name, description, status, priority, start_date, due_date, user_id: userId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}
