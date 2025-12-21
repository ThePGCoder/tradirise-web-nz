// app/listings/marketplace/components/VehicleCard.tsx
"use client";

import React, { useState } from "react";
import {
  Typography,
  CardContent,
  CardActions,
  Chip,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import Flex from "@/global/Flex";
import dayjs from "dayjs";
import FavouriteButton from "@/app/(dashboard)/my-favourites/components/FavouriteButton";
import ShareButton from "@/components/ShareButton";

import { VehicleAd } from "../page";
import MarketplaceContactDialog from "./MarketplaceContactDialog";

interface VehicleCardProps {
  vehicle: VehicleAd;
  onViewDetails: (id: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onViewDetails,
}) => {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NZ", {
      style: "currency",
      currency: "NZD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage?: number) => {
    if (!mileage) return "Not specified";
    return `${mileage.toLocaleString()} km`;
  };

  const getDaysAgo = (date: string): string => {
    const postedDate = dayjs(date);
    const today = dayjs();
    const diff = today.diff(postedDate, "day");

    if (diff === 0) return "today";
    if (diff === 1) return "yesterday";
    return `${diff} days ago`;
  };

  const getExpiryDays = (postedDate: string) => {
    const expiry = dayjs(postedDate).add(30, "days");
    const now = dayjs();
    return expiry.diff(now, "day");
  };

  const isExpired = dayjs().isAfter(dayjs(vehicle.posted_date).add(30, "days"));
  const expiryDays = getExpiryDays(vehicle.posted_date);

  // Handle both flattened (from views) and nested (from joins) data structures
  const displayAvatar = vehicle.is_business_listing
    ? vehicle.business_logo_url || vehicle.businesses?.logo_url || null
    : vehicle.avatar_url || vehicle.profiles?.avatar_url || null;

  const displayName = vehicle.is_business_listing
    ? vehicle.business_name ||
      vehicle.businesses?.business_name ||
      vehicle.contact_name
    : vehicle.contact_name;

  const firstName = vehicle.first_name || vehicle.profiles?.first_name;
  const username = vehicle.username || vehicle.profiles?.username;
  const businessName =
    vehicle.business_name || vehicle.businesses?.business_name;

  const avatarFallback = vehicle.is_business_listing
    ? (businessName?.[0] || vehicle.contact_name?.[0] || "B").toUpperCase()
    : (
        firstName?.[0] ||
        username?.[0] ||
        vehicle.contact_name?.[0] ||
        "U"
      ).toUpperCase();

  const handleContactSuccess = () => {
    // Optional: Show a success message or refresh data
    console.log("Contact request sent successfully");
  };

  return (
    <>
      <CustomCard
        sx={{
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.005)",
          },
          height: "100%",
          overflow: "hidden",
        }}
        onClick={() => onViewDetails(vehicle.id)}
      >
        {/* Vehicle Image */}
        <Box
          sx={{
            width: "100%",
            height: 200,
            backgroundColor: "grey.200",
            backgroundImage: vehicle.images?.[0]
              ? `url(${vehicle.images[0]})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {!vehicle.images?.[0] && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "grey.500",
              }}
            >
              <Icon icon="mdi:car" width={60} height={60} />
              <Typography variant="caption" sx={{ mt: 1 }}>
                No Image Available
              </Typography>
            </Box>
          )}
          {vehicle.images && vehicle.images.length > 1 && (
            <Chip
              label={`+${vehicle.images.length - 1} ${vehicle.images.length === 2 ? "photo" : "photos"}`}
              size="small"
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                fontSize: "0.7rem",
              }}
            />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, pb: 1, p: { xs: 2, md: 3 } }}>
          {/* Vehicle Header */}
          <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
            <Flex alignItems="center" gap={2} sx={{ mb: 0.5 }}>
              <Avatar
                src={displayAvatar || undefined}
                alt={displayName}
                sx={{
                  width: { xs: 40, md: 48 },
                  height: { xs: 40, md: 48 },
                  flexShrink: 0,
                }}
              >
                {avatarFallback}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: { xs: "1.1rem", sm: "1.5rem" },
                    fontWeight: "bold",
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                >
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {vehicle.vehicle_type}
                </Typography>
              </Box>
            </Flex>
          </Box>

          {/* Status Badges */}
          <Flex gap={1} sx={{ mb: 1, flexWrap: "wrap" }}>
            <Chip
              label={isExpired ? "Expired" : "Active"}
              size="small"
              color={isExpired ? "error" : "success"}
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
            {!isExpired && (
              <Chip
                label={`Expires in ${expiryDays} days`}
                size="small"
                color="warning"
                sx={{ fontSize: "0.7rem", height: 20 }}
              />
            )}
            <Chip
              label={vehicle.condition}
              size="small"
              color={vehicle.condition === "new" ? "success" : "default"}
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
            <Chip
              label={vehicle.price_type}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
            {vehicle.is_business_listing && (
              <Chip
                label="Business"
                size="small"
                color="primary"
                variant="outlined"
                icon={<Icon icon="mdi:domain" width={14} />}
                sx={{ fontSize: "0.7rem", height: 20 }}
              />
            )}
          </Flex>

          {/* Key Details */}
          <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
            {/* Price */}
            <Flex
              alignItems="center"
              gap={1}
              sx={{ py: { xs: 0.25, md: 0.5 } }}
            >
              <Box color="primary.main" sx={{ display: "flex" }}>
                <Icon icon="mdi:currency-usd" height={16} />
              </Box>
              <Typography variant="body2" fontWeight={600} color="primary.main">
                {formatPrice(vehicle.price)}
              </Typography>
            </Flex>

            {/* Location */}
            <Flex
              alignItems="center"
              gap={1}
              sx={{ py: { xs: 0.25, md: 0.5 } }}
            >
              <Box color="primary.main" sx={{ display: "flex" }}>
                <Icon icon="mdi:map-marker" height={16} />
              </Box>
              <Typography variant="body2">{vehicle.region}</Typography>
            </Flex>

            {/* Mileage */}
            <Flex
              alignItems="center"
              gap={1}
              sx={{ py: { xs: 0.25, md: 0.5 } }}
            >
              <Box color="primary.main" sx={{ display: "flex" }}>
                <Icon icon="mdi:speedometer" height={16} />
              </Box>
              <Typography variant="body2">
                {formatMileage(vehicle.mileage)}
              </Typography>
            </Flex>

            {/* Transmission & Fuel */}
            <Flex
              alignItems="center"
              gap={1}
              sx={{ py: { xs: 0.25, md: 0.5 } }}
            >
              <Box color="primary.main" sx={{ display: "flex" }}>
                <Icon icon="mdi:cog" height={16} />
              </Box>
              <Typography variant="body2">
                {vehicle.transmission || "N/A"} • {vehicle.fuel_type || "N/A"}
              </Typography>
            </Flex>

            {/* Posted Date */}
            <Flex
              alignItems="center"
              gap={1}
              sx={{ py: { xs: 0.25, md: 0.5 } }}
            >
              <Box color="primary.main" sx={{ display: "flex" }}>
                <Icon icon="mdi:calendar" height={16} />
              </Box>
              <Typography variant="body2">
                Posted {getDaysAgo(vehicle.posted_date)}
              </Typography>
            </Flex>
          </Box>
        </CardContent>

        <CardActions
          sx={{ p: { xs: 2, md: 2 }, pt: 0, justifyContent: "flex-end" }}
        >
          {/* View Button */}
          <Button
            size="small"
            variant="text"
            color="primary"
            startIcon={<Icon icon="mdi:magnify" width={16} height={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(vehicle.id);
            }}
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              minWidth: { xs: "auto", sm: "64px" },
              px: { xs: 1, sm: 2 },
            }}
          >
            <Box sx={{ display: { xs: "none", sm: "inline" } }}>View</Box>
          </Button>

          {/* Favourite Button */}
          <FavouriteButton
            itemType="vehicle"
            itemId={vehicle.id}
            size="small"
          />

          {/* Share Button */}
          <Box onClick={(e) => e.stopPropagation()}>
            <ShareButton
              useModal={true}
              variant="text"
              buttonText="Share"
              color="success"
              shareData={{
                url: `${window.location.origin}/listings/marketplace/vehicles/${vehicle.id}`,
                title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                description:
                  vehicle.description ||
                  `${vehicle.year} ${vehicle.make} ${vehicle.model} for ${formatPrice(vehicle.price)}`,
              }}
            />
          </Box>

          {/* Contact Button */}
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<Icon icon="mdi:email" width={16} height={16} />}
            onClick={(e) => {
              e.stopPropagation();
              setContactDialogOpen(true);
            }}
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              minWidth: { xs: "auto", sm: "64px" },
              px: { xs: 1, sm: 2 },
            }}
          >
            <Box sx={{ display: { xs: "none", sm: "inline" } }}>Contact</Box>
            <Box sx={{ display: { xs: "inline", sm: "none" } }}>Contact</Box>
          </Button>
        </CardActions>
      </CustomCard>

      {/* Contact Dialog */}
      <MarketplaceContactDialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        itemId={vehicle.id}
        itemType="vehicle"
        itemTitle={vehicle.title}
        itemSubtitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        onSuccess={handleContactSuccess}
      />
    </>
  );
};

export default VehicleCard;
