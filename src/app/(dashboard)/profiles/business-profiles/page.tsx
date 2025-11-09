// src/app/my-businesses/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MyBusinessesClient from "./components/MyBusinessesClient";
import { Business } from "@/types/business";

const MyBusinesses = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("auth_id", user.id);

  if (error) {
    console.error("Error fetching businesses:", error);
  }

  return (
    <MyBusinessesClient initialBusinesses={(businesses as Business[]) || []} />
  );
};

export default MyBusinesses;
