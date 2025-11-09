// app/my-listings/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deletePersonnelListing(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("personnel_ads")
    .delete()
    .eq("id", id)
    .eq("auth_id", user.id); // Extra security check

  if (error) {
    throw new Error(`Failed to delete personnel listing: ${error.message}`);
  }

  revalidatePath("/my-listings");
  return { success: true };
}

export async function deletePositionListing(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("position_ads")
    .delete()
    .eq("id", id)
    .eq("auth_id", user.id); // Extra security check

  if (error) {
    throw new Error(`Failed to delete position listing: ${error.message}`);
  }

  revalidatePath("/my-listings");
  return { success: true };
}

export async function deleteProjectListing(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("project_ads")
    .delete()
    .eq("id", id)
    .eq("auth_id", user.id); // Extra security check

  if (error) {
    throw new Error(`Failed to delete project listing: ${error.message}`);
  }

  revalidatePath("/my-listings");
  return { success: true };
}

export async function deleteBusinessListing(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("businesses")
    .delete()
    .eq("id", id)
    .eq("auth_id", user.id); // Extra security check

  if (error) {
    throw new Error(`Failed to delete business listing: ${error.message}`);
  }

  revalidatePath("/my-listings");
  return { success: true };
}
