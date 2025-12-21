"use client";

import { createClient } from "@/utils/supabase/client";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Button,
  Chip,
  Alert,
  useTheme,
} from "@mui/material";

import { Icon } from "@iconify/react";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import CustomCard from "@/components/CustomCard";
import PageHeader from "@/components/PageHeader";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import Iconify from "@/components/Iconify";

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

interface NotificationsClientProps {
  initialNotifications: Notification[];
  userId: string;
}

const NotificationsClient = ({
  initialNotifications,
  userId,
}: NotificationsClientProps) => {
  const supabase = createClient();
  const router = useRouter();
  const theme = useTheme();
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { changeActiveRoute } = useContext(ActiveRouteContext);

  useEffect(() => {
    changeActiveRoute("Notifications");
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [payload.new as Notification, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setNotifications((prev) =>
              prev.map((notif) =>
                notif.id === payload.new.id
                  ? (payload.new as Notification)
                  : notif
              )
            );
          } else if (payload.eventType === "DELETE") {
            setNotifications((prev) =>
              prev.filter((notif) => notif.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark all as read");
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to mark all as read"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      // Update local state
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId)
      );
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already
    if (!notification.read) {
      await handleMarkAsRead(notification.id);
    }

    // Navigate to link if exists
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return "mdi:message-text";
      case "personnel_contact":
        return "mdi:account-hard-hat";
      case "position_application":
        return "mdi:briefcase";
      case "project_application":
        return "mdi:folder-open";
      case "business_inquiry":
        return "mdi:store";
      case "vehicle_inquiry":
        return "mdi:car";
      case "plant_inquiry":
        return "mdi:excavator";
      case "material_inquiry":
        return "mdi:package-variant";
      default:
        return "mdi:bell";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "message":
        return theme.palette.primary.main;
      case "personnel_contact":
        return theme.palette.success.main;
      case "position_application":
        return theme.palette.info.main;
      case "project_application":
        return theme.palette.warning.main;
      case "business_inquiry":
        return theme.palette.secondary.main;
      case "vehicle_inquiry":
        return theme.palette.info.main;
      case "plant_inquiry":
        return theme.palette.warning.main;
      case "material_inquiry":
        return theme.palette.success.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Box margin="auto" width="100%" maxWidth={1400} px={2} pb={6}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <PageHeader title="Notifications" />
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} unread`}
              color="primary"
              size="small"
            />
          )}
        </Box>
        {unreadCount > 0 && (
          <Button
            variant="text"
            onClick={handleMarkAllAsRead}
            disabled={loading}
            startIcon={<Icon icon="mdi:check-all" />}
          >
            Mark all as read
          </Button>
        )}
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {notifications.length === 0 ? (
        <CustomCard>
          <Box
            sx={{
              p: 6,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Icon
              icon="mdi:bell-outline"
              width={64}
              height={64}
              style={{ opacity: 0.3 }}
            />
            <Typography variant="h6" color="text.secondary">
              No notifications yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We&#39;ll notify you when something important happens
            </Typography>
          </Box>
        </CustomCard>
      ) : (
        <Stack spacing={2}>
          {notifications.map((notification) => (
            <CustomCard
              undecorated={true}
              key={notification.id}
              sx={{
                cursor: notification.link ? "pointer" : "default",
                transition: "all 0.2s",
                bgcolor: notification.read
                  ? "background.paper"
                  : "action.hover",
                "&:hover": {
                  transform: notification.link ? "translateY(-2px)" : "none",
                  boxShadow: notification.link ? 3 : 1,
                },
              }}
              onClick={() => handleNotificationClick(notification)}
            >
              <Box sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: notification.read
                        ? "action.hover"
                        : "action.selected",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      icon={getNotificationIcon(notification.type)}
                      width={20}
                      height={20}
                      style={{ color: getNotificationColor(notification.type) }}
                    />
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: notification.read ? 400 : 600,
                        }}
                      >
                        {notification.title}
                      </Typography>
                      {!notification.read && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                      })}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Stack direction="row" spacing={0.5}>
                    {!notification.read && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        title="Mark as read"
                      >
                        <Iconify icon="mdi:tick-circle" color="success.main" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      title="Delete"
                    >
                      <Iconify icon="mdi:delete" color="error.main" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>
            </CustomCard>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default NotificationsClient;
