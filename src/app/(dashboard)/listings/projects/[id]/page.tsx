// app/listings/projects/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProjectDetailClient from "./components/ProjectDetailClient";

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
  business_id?: string;
  suburb?: string;
  profiles?: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
  businesses?: {
    business_name: string;
    logo_url: string;
  } | null;
}

async function getProject(id: string): Promise<ProjectData | null> {
  const supabase = await createClient();

  // Fetch project without joins first
  const { data: project, error: projectError } = await supabase
    .from("project_ads")
    .select("*")
    .eq("id", id)
    .single();

  if (projectError || !project) {
    return null;
  }

  // Fetch profile if auth_id exists
  let profile = null;
  if (project.auth_id) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("username, avatar_url, first_name, last_name")
      .eq("id", project.auth_id)
      .single();
    profile = profileData;
  }

  // Fetch business if business_id exists
  let business = null;
  if (project.business_id) {
    const { data: businessData } = await supabase
      .from("businesses")
      .select("business_name, logo_url")
      .eq("id", project.business_id)
      .single();
    business = businessData;
  }

  return {
    ...project,
    profiles: profile,
    businesses: business,
  } as ProjectData;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  const displayName = project.is_business_listing
    ? project.businesses?.business_name || project.company_name
    : project.posted_by;

  const description = project.description
    ? project.description.substring(0, 160)
    : `${project.title} - ${project.project_type} project in ${
        project.region
      }. Budget: ${project.price_range}. Looking for ${project.required_trades
        .slice(0, 3)
        .join(", ")}.`;

  return {
    title: `${project.title} - ${project.project_type} | Project Listing`,
    description,
    openGraph: {
      title: `${project.title} - ${project.project_type}`,
      description,
      type: "website",
      images:
        project.is_business_listing && project.businesses?.logo_url
          ? [
              {
                url: project.businesses.logo_url,
                width: 1200,
                height: 630,
                alt: `${displayName} logo`,
              },
            ]
          : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} - ${project.project_type}`,
      description,
      images:
        project.is_business_listing && project.businesses?.logo_url
          ? [project.businesses.logo_url]
          : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
