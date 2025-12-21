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
  //useMediaQuery,
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

interface Vehicle {
  id: string;
  title: string;
  vehicle_type: string;
  make: string;
  model: string;
  year: number;
  price: number;
  region: string;
  images?: string[];
}

interface Plant {
  id: string;
  title: string;
  equipment_type: string;
  category: string;
  sale_price?: number;
  price_type: string;
  region: string;
  images?: string[];
}

interface Material {
  id: string;
  title: string;
  material_type: string;
  category: string;
  price: number;
  unit: string;
  region: string;
  images?: string[];
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
  vehicle?: Vehicle;
  plant?: Plant;
  material?: Material;
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
  //const theme = useTheme();

  const [activeTab, setActiveTab] = useState<
    | "all"
    | "personnel"
    | "business"
    | "position"
    | "project"
    | "vehicle"
    | "plant"
    | "material"
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
    setActiveTab(newValue as typeof activeTab);
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
      vehicle: `/listings/marketplace/vehicles/${itemId}`,
      plant: `/listings/marketplace/plant/${itemId}`,
      material: `/listings/marketplace/material/${itemId}`,
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
  const vehicleCount = favourites.filter(
    (f) => f.item_type === "vehicle"
  ).length;
  const plantCount = favourites.filter((f) => f.item_type === "plant").length;
  const materialCount = favourites.filter(
    (f) => f.item_type === "material"
  ).length;

  const tabs = [
    { label: "All", value: "all", count: favourites.length },
    { label: "Tradies", value: "personnel", count: personnelCount },
    { label: "Businesses", value: "business", count: businessCount },
    { label: "Positions", value: "position", count: positionCount },
    { label: "Projects", value: "project", count: projectCount },
    { label: "Vehicles", value: "vehicle", count: vehicleCount },
    { label: "Plant", value: "plant", count: plantCount },
    { label: "Materials", value: "material", count: materialCount },
  ];

  //const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      case "vehicle":
        return {
          icon: "mdi:car",
          title: "No saved vehicles yet",
          description: "Start favouriting vehicles to view them here",
        };
      case "plant":
        return {
          icon: "mdi:excavator",
          title: "No saved equipment yet",
          description: "Start favouriting plant & equipment to view them here",
        };
      case "material":
        return {
          icon: "mdi:package-variant",
          title: "No saved materials yet",
          description: "Start favouriting materials to view them here",
        };
      default:
        return {
          icon: "mdi:star-outline",
          title: "No favourites yet",
          description: "Start favouriting items to view them here",
        };
    }
  };

  // Helper to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NZ", {
      style: "currency",
      currency: "NZD",
      minimumFractionDigits: 0,
    }).format(price);
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
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={
                  <TabLabelWithBadge label={tab.label} count={tab.count} />
                }
                value={tab.value}
                sx={{
                  textTransform: "none",
                  minWidth: { xs: 80, sm: 100 },
                  flex: { xs: "0 0 auto", md: 1 },
                }}
              />
            ))}
          </Tabs>
        </Box>
      </InnerCustomCard>

      {/* Results count */}
      {filteredFavourites.length > 0 && (
        <Typography variant="body2" color="text.secondary" mb={2} mt={1}>
          Showing {filteredFavourites.length}{" "}
          {activeTab === "all" ? "favourite" : activeTab}
          {filteredFavourites.length !== 1 ? "s" : ""}
        </Typography>
      )}

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
                    : favourite.item_type === "project"
                      ? favourite.project?.title || "Project"
                      : favourite.item_type === "vehicle"
                        ? favourite.vehicle?.title || "Vehicle"
                        : favourite.item_type === "plant"
                          ? favourite.plant?.title || "Equipment"
                          : favourite.material?.title || "Material";

            // Determine subtitle
            const subtitle =
              favourite.item_type === "personnel"
                ? favourite.personnel?.primary_trade_role
                : favourite.item_type === "business"
                  ? favourite.businesses?.business_type
                  : favourite.item_type === "position"
                    ? favourite.position?.trade
                    : favourite.item_type === "project"
                      ? favourite.project?.project_type
                      : favourite.item_type === "vehicle"
                        ? favourite.vehicle?.vehicle_type
                        : favourite.item_type === "plant"
                          ? favourite.plant?.equipment_type
                          : favourite.material?.material_type;

            // Determine avatar/logo/image
            const avatarUrl =
              favourite.item_type === "personnel"
                ? favourite.personnel?.avatar_url
                : favourite.item_type === "business"
                  ? favourite.businesses?.logo_url
                  : favourite.item_type === "vehicle"
                    ? favourite.vehicle?.images?.[0]
                    : favourite.item_type === "plant"
                      ? favourite.plant?.images?.[0]
                      : favourite.item_type === "material"
                        ? favourite.material?.images?.[0]
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
                      p: 2,
                    }}
                  >
                    {/* Header with Avatar/Logo/Image */}
                    <Flex alignItems="flex-start" gap={2} mb={2}>
                      <Avatar
                        src={avatarUrl || undefined}
                        sx={{
                          width: 56,
                          height: 56,
                          flexShrink: 0,
                        }}
                        variant={
                          favourite.item_type === "vehicle" ||
                          favourite.item_type === "plant" ||
                          favourite.item_type === "material"
                            ? "rounded"
                            : "circular"
                        }
                      >
                        {!avatarUrl &&
                          (favourite.item_type === "personnel"
                            ? favourite.personnel?.first_name?.[0] ||
                              favourite.personnel?.primary_trade_role?.[0] ||
                              "P"
                            : favourite.item_type === "business"
                              ? favourite.businesses?.business_name?.[0] || "B"
                              : favourite.item_type === "vehicle"
                                ? "V"
                                : favourite.item_type === "plant"
                                  ? "P"
                                  : "M")}
                      </Avatar>
                      <Box flex={1} minWidth={0}>
                        <Typography
                          variant="h6"
                          mb={0.5}
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.3,
                            minHeight: "2.6em",
                          }}
                        >
                          {title}
                        </Typography>
                        {subtitle && (
                          <Chip
                            label={subtitle}
                            size="small"
                            sx={{
                              maxWidth: "100%",
                              "& .MuiChip-label": {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              },
                            }}
                          />
                        )}
                      </Box>
                    </Flex>

                    {/* Details based on item type - Fixed height container */}
                    <Box sx={{ minHeight: 90, mb: 2 }}>
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
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
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
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {favourite.businesses.city}
                                  {favourite.businesses.region
                                    ? `, ${favourite.businesses.region}`
                                    : ""}
                                </Typography>
                              </Flex>
                            )}
                            {favourite.businesses.years_in_trading && (
                              <Flex alignItems="center" gap={0.5} mb={0.5}>
                                <Box color="primary.main">
                                  <Icon icon="mdi:calendar-clock" width={14} />
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {favourite.businesses.years_in_trading} years
                                  in business
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
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
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
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {favourite.position.rate}
                              </Typography>
                            </Flex>
                            {favourite.position.start_date && (
                              <Flex alignItems="center" gap={0.5} mb={0.5}>
                                <Box color="primary.main">
                                  <Icon icon="mdi:calendar-start" width={14} />
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Start:{" "}
                                  {new Date(
                                    favourite.position.start_date
                                  ).toLocaleDateString()}
                                </Typography>
                              </Flex>
                            )}
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
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
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
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {favourite.project.price_range}
                              </Typography>
                            </Flex>
                            {favourite.project.proposed_start_date && (
                              <Flex alignItems="center" gap={0.5} mb={0.5}>
                                <Box color="primary.main">
                                  <Icon icon="mdi:calendar-start" width={14} />
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Start:{" "}
                                  {new Date(
                                    favourite.project.proposed_start_date
                                  ).toLocaleDateString()}
                                </Typography>
                              </Flex>
                            )}
                          </>
                        )}

                      {/* Vehicle details */}
                      {favourite.item_type === "vehicle" &&
                        favourite.vehicle && (
                          <>
                            <Flex alignItems="center" gap={0.5} mb={0.5}>
                              <Box color="primary.main">
                                <Icon icon="mdi:map-marker" width={14} />
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {favourite.vehicle.region}
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
                                {formatPrice(favourite.vehicle.price)}
                              </Typography>
                            </Flex>
                            <Flex alignItems="center" gap={0.5} mb={0.5}>
                              <Box color="primary.main">
                                <Icon icon="mdi:car-info" width={14} />
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {favourite.vehicle.year}{" "}
                                {favourite.vehicle.make}{" "}
                                {favourite.vehicle.model}
                              </Typography>
                            </Flex>
                          </>
                        )}

                      {/* Plant details */}
                      {favourite.item_type === "plant" && favourite.plant && (
                        <>
                          <Flex alignItems="center" gap={0.5} mb={0.5}>
                            <Box color="primary.main">
                              <Icon icon="mdi:map-marker" width={14} />
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {favourite.plant.region}
                            </Typography>
                          </Flex>
                          <Flex alignItems="center" gap={0.5} mb={0.5}>
                            <Box color="primary.main">
                              <Icon icon="mdi:currency-usd" width={14} />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {favourite.plant.sale_price
                                ? formatPrice(favourite.plant.sale_price)
                                : "POA"}
                            </Typography>
                          </Flex>
                          <Flex alignItems="center" gap={0.5} mb={0.5}>
                            <Box color="primary.main">
                              <Icon icon="mdi:tag" width={14} />
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {favourite.plant.price_type}
                            </Typography>
                          </Flex>
                        </>
                      )}

                      {/* Material details */}
                      {favourite.item_type === "material" &&
                        favourite.material && (
                          <>
                            <Flex alignItems="center" gap={0.5} mb={0.5}>
                              <Box color="primary.main">
                                <Icon icon="mdi:map-marker" width={14} />
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {favourite.material.region}
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
                                {formatPrice(favourite.material.price)} per{" "}
                                {favourite.material.unit}
                              </Typography>
                            </Flex>
                            <Flex alignItems="center" gap={0.5} mb={0.5}>
                              <Box color="primary.main">
                                <Icon icon="mdi:shape" width={14} />
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {favourite.material.category}
                              </Typography>
                            </Flex>
                          </>
                        )}
                    </Box>

                    {/* Description preview (for position and project only) - Fixed height */}
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
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          minHeight: "3.6em",
                          lineHeight: 1.2,
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
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
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
