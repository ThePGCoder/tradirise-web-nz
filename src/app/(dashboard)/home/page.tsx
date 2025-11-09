// src/app/home/page.tsx (Server Component)
import { getUser } from "@/utils/supabase/server";
import { createClient } from "@/utils/supabase/server";
import HomeClient from "./components/HomePageClient";

interface ProfileData {
  username: string;
  first_name: string | null;
  last_name: string | null;
}

export default async function HomePage() {
  // ✅ Fetch user on server
  const user = await getUser();

  let profile: ProfileData | null = null;

  // ✅ Fetch profile on server if user is authenticated
  if (user) {
    const supabase = await createClient();
    const { data: profileData } = await supabase
      .from("profiles")
      .select("username, first_name, last_name")
      .eq("id", user.id)
      .single();

    profile = profileData;
  }

  // ✅ Pass data to client component
  return <HomeClient user={user} profile={profile} />;
}
