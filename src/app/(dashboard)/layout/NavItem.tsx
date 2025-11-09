"use client";

import {
  Box,
  Collapse,
  IconButton,
  IconButtonProps,
  Badge,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import React, { useContext, useState, useEffect } from "react";

import {
  lightGradient,
  darkGradient,
  lightShadow,
  darkShadow,
  lightTheme,
  darkTheme,
} from "@/styles/theme";
import { createClient } from "@/utils/supabase/client";
import { useThemeMode } from "@/hooks/useThemeMode";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import { NavProps } from "@/types/navItem";

interface NavItemProps {
  item: NavProps;
  toggleDrawer?: () => void;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "expand",
})<ExpandMoreProps>(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const NavItem: React.FC<NavItemProps> = ({ item, toggleDrawer }) => {
  const supabase = createClient();
  const { activeRoute, changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { mode } = useThemeMode();

  useEffect(() => {
    if (item.dropdown && item.subMenu?.some((s) => s.title === activeRoute)) {
      setExpanded(true); // auto expand if a subItem is active
    }
  }, [activeRoute, item]);

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      // Only fetch for Notifications nav item
      if (item.title !== "Notifications") return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);

      setUnreadCount(count || 0);
    };

    fetchUnreadCount();

    // Set up real-time subscription for notifications
    if (item.title === "Notifications") {
      const channel = supabase
        .channel("nav-notifications")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
          },
          () => {
            // Refetch count when notifications change
            fetchUnreadCount();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [item.title, supabase]);

  const logOut = async () => {
    await supabase.auth.signOut();

    router.push("/login");
  };

  const handleClick = async () => {
    if (item.title === "Logout") {
      await logOut();
      return;
    }

    if (item.dropdown) {
      setExpanded((prev) => !prev);
    }

    if (!item.dropdown && item.link) {
      router.push(item.link);
    }

    //changeActiveRoute(item.title);

    if (!item.dropdown && toggleDrawer) {
      toggleDrawer();
    }
  };

  const getTextColor = (title: string) => {
    const isActive = activeRoute === title;
    const isDropdownParent = item.dropdown && item.title === title;
    if (isActive && !isDropdownParent) {
      return mode === "dark" ? "#161616" : "white";
    }
    return mode === "dark" ? "white" : "black";
  };

  const getIconColor = (title: string) => {
    const isActive = activeRoute === title;
    const isDropdownParent = item.dropdown && item.title === title;
    if (isActive && !isDropdownParent) {
      return mode === "dark" ? "#161616" : "white";
    }
    return mode === "light"
      ? lightTheme.palette.primary.main
      : darkTheme.palette.primary.main;
  };

  const getBackground = (title: string) => {
    const isActive = activeRoute === title;
    const isDropdownParent = item.dropdown && item.title === title;
    if (isActive && !isDropdownParent) {
      return mode === "light" ? darkGradient : lightGradient;
    }
    return "";
  };

  return (
    <>
      <Box
        sx={{
          background: getBackground(item.title),
          "&:hover": {
            boxShadow: mode === "light" ? lightShadow : darkShadow,
          },
        }}
        paddingLeft="10px"
        height="40px"
        borderRadius="6px"
        onClick={handleClick}
        display="flex"
        alignItems="center"
        justifyContent={item.dropdown ? "space-between" : ""}
      >
        <Box display="inherit" alignItems="inherit">
          {/* Show badge only for Notifications with unread count */}
          {item.title === "Notifications" && unreadCount > 0 ? (
            <Badge
              badgeContent={unreadCount}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.65rem",
                  height: "16px",
                  minWidth: "16px",
                  padding: "0 4px",
                },
              }}
            >
              <Icon
                icon={item.icon}
                color={getIconColor(item.title)}
                height={20}
              />
            </Badge>
          ) : (
            <Icon
              icon={item.icon}
              color={getIconColor(item.title)}
              height={20}
            />
          )}
          <Box width="10px" />
          <Box color={getTextColor(item.title)}>{item.title}</Box>
        </Box>

        {item.dropdown && (
          <ExpandMore expand={expanded}>
            <Icon icon="mdi:chevron-down" color={getIconColor(item.title)} />
          </ExpandMore>
        )}
      </Box>

      <Collapse in={expanded}>
        {item.subMenu?.map((subItem: NavProps) => (
          <Box
            key={subItem.title}
            sx={{
              background: getBackground(subItem.title),
              "&:hover": {
                boxShadow: mode === "light" ? lightShadow : darkShadow,
              },
            }}
            mt={1} // slightly less margin than parent
            mx={4} // more indentation compared to parent
            pl={2} // extra padding left
            height="32px" // smaller height
            borderRadius="6px"
            onClick={() => {
              if (subItem.link) {
                router.push(subItem.link);
              }
              changeActiveRoute(subItem.title);
              if (!subItem.dropdown && toggleDrawer) {
                toggleDrawer();
              }
            }}
            display="flex"
            alignItems="center"
          >
            <Box display="inherit" alignItems="inherit">
              <Icon
                icon={subItem.icon}
                color={getIconColor(subItem.title)}
                height={18} // smaller icon
              />
              <Box width="8px" />
              <Box color={getTextColor(subItem.title)} fontSize="0.9rem">
                {subItem.title}
              </Box>
            </Box>
          </Box>
        ))}
      </Collapse>
    </>
  );
};

export default NavItem;
