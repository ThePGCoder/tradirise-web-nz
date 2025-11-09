// app/my-listings/projects/view/[id]/page.tsx (Server Component)
import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import ProjectViewClient from "./components/ProjectsViewClient";

interface ProjectData {
  id: string;
  title: string;
  required_trades: string[];
  description: string;
  region: string;
  price_range: string;
  proposed_start_date: string;
  project_duration: string;
  project_type: string;
  materials_provided: string[];
  contact_email: string;
  contact_phone: string | null;
  company_name: string;
  posted_by: string;
  is_business_listing: boolean;
  auth_id: string;
  posted_date: string;
  updated_at: string;
  status: string;
  business_id: string;
  profiles: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
}

async function getProjectData(projectId: string): Promise<ProjectData> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("project_ads")
    .select(
      `
      *,
      profiles (
        username,
        avatar_url,
        first_name,
        last_name
      )
    `
    )
    .eq("id", projectId)
    .eq("auth_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    notFound();
  }

  if (!data) {
    notFound();
  }

  return data;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectViewPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectData(id);

  return <ProjectViewClient project={project} />;
}
