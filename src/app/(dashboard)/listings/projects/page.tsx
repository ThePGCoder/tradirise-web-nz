// app/listings/projects/page.tsx
import { createClient } from "@/utils/supabase/server";
import ProjectsClient from "./ProjectsClient";
import { Project } from "@/types/projects";

const ITEMS_PER_PAGE = 20;

export interface ProjectWithProfiles extends Project {
  profiles?: {
    id: string;
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
  businesses?: {
    id: string;
    business_name: string;
    logo_url: string;
  } | null;
}

interface ProjectsPageProps {
  searchParams: Promise<{ page?: string }>;
}

const ProjectsPage = async ({ searchParams }: ProjectsPageProps) => {
  const supabase = await createClient();

  // Get page from search params
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // Fetch projects with pagination and count
  const {
    data: projects,
    error: projectsError,
    count,
  } = await supabase
    .from("project_ads")
    .select("*", { count: "exact" })
    .eq("status", "active")
    .order("posted_date", { ascending: false })
    .range(from, to);

  if (projectsError) {
    console.error("Error fetching projects:", projectsError);
    throw new Error("Failed to load projects data");
  }

  if (!projects || projects.length === 0) {
    return (
      <ProjectsClient
        initialProjects={[]}
        currentPage={page}
        totalPages={0}
        totalCount={0}
      />
    );
  }

  // Get unique auth_ids and business_ids
  const authIds = [...new Set(projects.map((p) => p.auth_id).filter(Boolean))];
  const businessIds = [
    ...new Set(projects.map((p) => p.business_id).filter(Boolean)),
  ];

  // Fetch profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, first_name, last_name")
    .in("id", authIds);

  // Fetch businesses
  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, business_name, logo_url")
    .in("id", businessIds);

  // Create lookup maps
  const profilesMap = new Map(profiles?.map((p) => [p.id, p]) || []);
  const businessesMap = new Map(businesses?.map((b) => [b.id, b]) || []);

  // Merge data
  const enrichedProjects = projects.map((project) => ({
    ...project,
    profiles: project.auth_id ? profilesMap.get(project.auth_id) || null : null,
    businesses: project.business_id
      ? businessesMap.get(project.business_id) || null
      : null,
  }));

  console.log("Fetched projects count:", enrichedProjects.length);
  if (enrichedProjects.length > 0) {
    console.log("First project sample:", {
      id: enrichedProjects[0].id,
      title: enrichedProjects[0].title,
      has_profile: !!enrichedProjects[0].profiles,
      has_business: !!enrichedProjects[0].businesses,
    });
  }

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

  return (
    <ProjectsClient
      initialProjects={enrichedProjects as Project[]}
      currentPage={page}
      totalPages={totalPages}
      totalCount={count || 0}
    />
  );
};

export default ProjectsPage;
