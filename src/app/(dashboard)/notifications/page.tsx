import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NotificationsClient from "./components/NotificationClient";

const NotificationsPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch notifications
  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching notifications:", error);
  }

  return (
    <NotificationsClient
      initialNotifications={notifications || []}
      userId={user.id}
    />
  );
};

export default NotificationsPage;
