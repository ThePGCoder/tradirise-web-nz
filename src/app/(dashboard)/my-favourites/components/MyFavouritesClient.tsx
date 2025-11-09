// app/my-favourites/components/MyFavouritesClient.tsx
"use client";

import React, { useContext, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Box,
  Tab,
  Tabs,
  Button,
  CircularProgress,
  Avatar,
  Chip,
  useMediaQuery,
  useTheme,
  Grid,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Flex from "@/global/Flex";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import CustomCard from "@/components/CustomCard";
import PageHeader from "@/components/PageHeader";
import InnerCustomCard from "@/components/InnerCustomCard";
import EmptyResult from "@/components/EmptyResult";

interface Personnel {
  id: string;
  first_name: string;
  last_name: string;
  primary_trade_role?: string;
  avatar_url?: string;
  region?: string;
  auth_id: string;
}

interface Business {
  id: string;
  business_name: string;
  business_type?: string;
  logo_url?: string;
  region?: string;
  city?: string;
  years_in_trading?: number;
}

interface Position {
  id: string;
  title: string;
  trade: string;
  rate: string;
  region: string;
  start_date: string;
  posted_date: string;
  remuneration: string;
  description: string;
  posted_by: string;
  is_business_listing: boolean;
  auth_id: string;
  business_id?: string | null;
}

interface Project {
  id: string;
  title: string;
  project_type: string;
  price_range: string;
  region: string;
  proposed_start_date: string;
  posted_date: string;
  description: string;
  posted_by: string;
  is_business_listing: boolean;
  auth_id: string;
  business_id?: string | null;
  project_duration?: string;
  required_trades?: string[];
  budget_min?: number;
  budget_max?: number;
  start_date?: string;
  suburb?: string;
}

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
  first_name: string;
  last_name: string;
}

interface BusinessProfile {
  id: string;
  business_name: string;
  logo_url: string;
}

interface Favourite {
  id: string;
  item_type: string;
  item_id: string;
  created_at: string;
  notes: string | null;
  personnel?: Personnel;
  businesses?: Business;
  position?: Position;
  project?: Project;
  poster_profile?: UserProfile;
  poster_business?: BusinessProfile;
}

interface MyFavouritesClientProps {
  initialFavourites: Favourite[];
  userId: string;
}

// Tab Label with Badge Component
const TabLabelWithBadge = ({
  label,
  count,
}: {
  label: string;
  count: number;
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography component="span">{label}</Typography>
      {count > 0 && (
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderRadius: "50%",
            minWidth: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 600,
            px: 0.5,
          }}
        >
          <span>{count > 99 ? "99+" : count}</span>
        </Box>
      )}
    </Box>
  );
};

const MyFavouritesClient: React.FC<MyFavouritesClientProps> = ({
  initialFavourites,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const theme = useTheme();

  const [activeTab, setActiveTab] = useState<
    "all" | "personnel" | "business" | "position" | "project"
  >("all");
  const [favourites, setFavourites] = useState<Favourite[]>(initialFavourites);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    changeActiveRoute("My Favourites");
  }, [changeActiveRoute]);

  // Filter favourites based on active tab
  const filteredFavourites = useMemo(() => {
    if (activeTab === "all") return favourites;
    return favourites.filter((fav) => fav.item_type === activeTab);
  }, [favourites, activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(
      newValue as "all" | "personnel" | "business" | "position" | "project"
    );
  };

  const handleRemoveFavourite = async (
    favId: string,
    itemType: string,
    itemId: string
  ) => {
    setRemovingIds((prev) => new Set(prev).add(favId));

    try {
      const response = await fetch(
        `/api/my-favourites?item_type=${itemType}&item_id=${itemId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setFavourites((prev) => prev.filter((fav) => fav.id !== favId));
      } else {
        console.error("Failed to remove favourite");
      }
    } catch (error) {
      console.error("Error removing favourite:", error);
    } finally {
      setRemovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(favId);
        return newSet;
      });
    }
  };

  const handleViewDetails = (itemType: string, itemId: string) => {
    const routes = {
      personnel: `/listings/personnel/${itemId}`,
      business: `/listings/businesses/${itemId}`,
      position: `/listings/positions/${itemId}`,
      project: `/listings/projects/${itemId}`,
    };
    router.push(routes[itemType as keyof typeof routes]);
  };

  // Count items by type
  const personnelCount = favourites.filter(
    (f) => f.item_type === "personnel"
  ).length;
  const businessCount = favourites.filter(
    (f) => f.item_type === "business"
  ).length;
  const positionCount = favourites.filter(
    (f) => f.item_type === "position"
  ).length;
  const projectCount = favourites.filter(
    (f) => f.item_type === "project"
  ).length;

  const tabs = [
    { label: "All", value: "all", count: favourites.length },
    { label: "Tradies", value: "personnel", count: personnelCount },
    { label: "Businesses", value: "business", count: businessCount },
    { label: "Positions", value: "position", count: positionCount },
    { label: "Projects", value: "project", count: projectCount },
  ];

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Helper function to get empty state info based on tab
  const getEmptyStateInfo = () => {
    switch (activeTab) {
      case "personnel":
        return {
          icon: "entypo:v-card",
          title: "No saved tradies yet",
          description: "Start favouriting tradies to view them here",
        };
      case "business":
        return {
          icon: "ic:baseline-business",
          title: "No saved businesses yet",
          description: "Start favouriting businesses to view them here",
        };
      case "position":
        return {
          icon: "fluent:person-star-16-filled",
          title: "No saved positions yet",
          description: "Start favouriting positions to view them here",
        };
      case "project":
        return {
          icon: "mingcute:house-fill",
          title: "No saved projects yet",
          description: "Start favouriting projects to view them here",
        };
      default:
        return {
          icon: "mdi:star-outline",
          title: "No favourites yet",
          description: "Start favouriting items to view them here",
        };
    }
  };

  return (
    <Box margin="auto" width="100%" maxWidth={1400} px={2} pb={6}>
      <PageHeader
        title="My Favourites"
        description="View and manage all your saved items"
      />

      <InnerCustomCard>
        <Box>
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={
                  <TabLabelWithBadge label={tab.label} count={tab.count} />
                }
                value={tab.value}
                sx={{ textTransform: "none" }}
              />
            ))}
          </Tabs>

          {/* Results count */}
          {filteredFavourites.length > 0 && (
            <Typography variant="body2" color="text.secondary" mb={2}>
              Showing {filteredFavourites.length}{" "}
              {activeTab === "all"
                ? "favourite"
                : activeTab === "personnel"
                  ? "tradie"
                  : activeTab}
              {filteredFavourites.length !== 1 ? "s" : ""}
            </Typography>
          )}
        </Box>
      </InnerCustomCard>

      {/* Favourites Grid */}
      {filteredFavourites.length > 0 ? (
        <Grid container spacing={3}>
          {filteredFavourites.map((favourite) => {
            const isRemoving = removingIds.has(favourite.id);

            // Determine title based on item type
            const title =
              favourite.item_type === "personnel"
                ? `${favourite.personnel?.first_name || ""} ${favourite.personnel?.last_name || ""}`.trim() ||
                  favourite.personnel?.primary_trade_role ||
                  "Personnel"
                : favourite.item_type === "business"
                  ? favourite.businesses?.business_name || "Business"
                  : favourite.item_type === "position"
                    ? favourite.position?.title || "Position"
                    : favourite.project?.title || "Project";

            // Determine subtitle
            const subtitle =
              favourite.item_type === "personnel"
                ? favourite.personnel?.primary_trade_role
                : favourite.item_type === "business"
                  ? favourite.businesses?.business_type
                  : favourite.item_type === "position"
                    ? favourite.position?.trade
                    : favourite.project?.project_type;

            // Determine avatar/logo
            const avatarUrl =
              favourite.item_type === "personnel"
                ? favourite.personnel?.avatar_url
                : favourite.item_type === "business"
                  ? favourite.businesses?.logo_url
                  : null;

            return (
              <Grid
                key={favourite.id}
                size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 3 }}
              >
                <CustomCard
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    {/* Header with Avatar/Logo */}
                    <Flex alignItems="center" gap={2} mb={2}>
                      <Avatar
                        src={avatarUrl || undefined}
                        sx={{ width: 56, height: 56 }}
                      >
                        {!avatarUrl &&
                          (favourite.item_type === "personnel"
                            ? favourite.personnel?.first_name?.[0] ||
                              favourite.personnel?.primary_trade_role?.[0] ||
                              "P"
                            : favourite.item_type === "business"
                              ? favourite.businesses?.business_name?.[0] || "B"
                              : favourite.item_type === "position"
                                ? "P"
                                : "P")}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" mb={0.5}>
                          {title}
                        </Typography>
                        {subtitle && <Chip label={subtitle} size="small" />}
                      </Box>
                    </Flex>

                    {/* Details based on item type */}
                    <Box mb={2}>
                      {/* Personnel details */}
                      {favourite.item_type === "personnel" &&
                        favourite.personnel && (
                          <>
                            {favourite.personnel.region && (
                              <Flex alignItems="center" gap={0.5} mb={0.5}>
                                <Box color="primary.main">
                                  <Icon icon="mdi:map-marker" width={14} />
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {favourite.personnel.region}
                                </Typography>
                              </Flex>
                            )}
                          </>
                        )}

                      {/* Business details */}
                      {favourite.item_type === "business" &&
                        favourite.businesses && (
                          <>
                            {favourite.businesses.city && (
                              <Flex alignItems="center" gap={0.5} mb={0.5}>
                                <Box color="primary.main">
                                  <Icon icon="mdi:map-marker" width={14} />
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {favourite.businesses.city}
                                  {favourite.businesses.region
                                    ? `, ${favourite.businesses.region}`
                                    : ""}
                                </Typography>
                              </Flex>
                            )}
                          </>
                        )}

                      {/* Position details */}
                      {favourite.item_type === "position" &&
                        favourite.position && (
                          <>
                            <Flex alignItems="center" gap={0.5} mb={0.5}>
                              <Box color="primary.main">
                                <Icon icon="mdi:map-marker" width={14} />
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {favourite.position.region}
                              </Typography>
                            </Flex>
                            <Flex alignItems="center" gap={0.5} mb={0.5}>
                              <Box color="primary.main">
                                <Icon icon="mdi:cash" width={14} />
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {favourite.position.rate}
                              </Typography>
                            </Flex>
                          </>
                        )}

                      {/* Project details */}
                      {favourite.item_type === "project" &&
                        favourite.project && (
                          <>
                            <Flex alignItems="center" gap={0.5} mb={0.5}>
                              <Box color="primary.main">
                                <Icon icon="mdi:map-marker" width={14} />
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {favourite.project.region}
                              </Typography>
                            </Flex>
                            <Flex alignItems="center" gap={0.5} mb={0.5}>
                              <Box color="primary.main">
                                <Icon icon="mdi:currency-usd" width={14} />
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {favourite.project.price_range}
                              </Typography>
                            </Flex>
                          </>
                        )}
                    </Box>

                    {/* Description preview */}
                    {(favourite.position?.description ||
                      favourite.project?.description) && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={2}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {favourite.position?.description ||
                          favourite.project?.description}
                      </Typography>
                    )}

                    {/* Saved Date */}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mb={2}
                    >
                      Saved{" "}
                      {new Date(favourite.created_at).toLocaleDateString()}
                    </Typography>

                    {/* Notes */}
                    {favourite.notes && (
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: "action.hover",
                          borderRadius: 1,
                          mb: 2,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Notes:
                        </Typography>
                        <Typography variant="body2">
                          {favourite.notes}
                        </Typography>
                      </Box>
                    )}

                    {/* Spacer to push buttons to bottom */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Action Buttons */}
                    <Flex gap={1} justifyContent="space-between" mt={2}>
                      <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        startIcon={
                          <Icon icon="mdi:eye" width={16} height={16} />
                        }
                        onClick={() =>
                          handleViewDetails(
                            favourite.item_type,
                            favourite.item_id
                          )
                        }
                        sx={{
                          textTransform: "none",
                          "& .MuiButton-startIcon": {
                            marginRight: "8px",
                            display: "flex",
                            alignItems: "center",
                          },
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        color="error"
                        fullWidth
                        startIcon={
                          isRemoving ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <Icon icon="mdi:remove" width={16} height={16} />
                          )
                        }
                        onClick={() =>
                          handleRemoveFavourite(
                            favourite.id,
                            favourite.item_type,
                            favourite.item_id
                          )
                        }
                        disabled={isRemoving}
                        sx={{
                          textTransform: "none",
                          "& .MuiButton-startIcon": {
                            marginRight: "8px",
                            display: "flex",
                            alignItems: "center",
                          },
                        }}
                      >
                        Remove
                      </Button>
                    </Flex>
                  </Box>
                </CustomCard>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <EmptyResult
          icon={getEmptyStateInfo().icon}
          title={getEmptyStateInfo().title}
          description={getEmptyStateInfo().description}
          showButton={false}
          height="60vh"
        />
      )}
    </Box>
  );
};

export default MyFavouritesClient;
