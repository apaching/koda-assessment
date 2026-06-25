import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../utils/supabase/server";
import type { ProjectInsert, ProjectStatus, ProjectPriority } from "../../../types/types";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status") as ProjectStatus | null;
  const priority = searchParams.get("priority") as ProjectPriority | null;
  const client_name = searchParams.get("client_name");
  const search = searchParams.get("search");

  let query = supabase.from("projects").select("*").order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (client_name) query = query.ilike("client_name", `%${client_name}%`);
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const body: ProjectInsert = await request.json();
  const { name, client_name, description, status, priority, start_date, due_date } = body;

  const { data, error } = await supabase
    .from("projects")
    .insert({ name, client_name, description, status, priority, start_date, due_date })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}
