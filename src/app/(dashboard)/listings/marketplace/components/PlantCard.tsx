// app/listings/marketplace/components/PlantCard.tsx
"use client";

import React from "react";
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
import { PlantAd } from "../page";

interface PlantCardProps {
  plant: PlantAd;
  onViewDetails: (id: string) => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onViewDetails }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NZ", {
      style: "currency",
      currency: "NZD",
      minimumFractionDigits: 0,
    }).format(price);
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

  const isExpired = dayjs().isAfter(dayjs(plant.posted_date).add(30, "days"));
  const expiryDays = getExpiryDays(plant.posted_date);

  // Handle both flattened (from views) and nested (from joins) data structures
  const displayAvatar = plant.is_business_listing
    ? plant.business_logo_url || plant.businesses?.logo_url || null
    : plant.avatar_url || plant.profiles?.avatar_url || null;

  const displayName = plant.is_business_listing
    ? plant.business_name ||
      plant.businesses?.business_name ||
      plant.contact_name
    : plant.contact_name;

  const firstName = plant.first_name || plant.profiles?.first_name;
  const username = plant.username || plant.profiles?.username;
  const businessName = plant.business_name || plant.businesses?.business_name;

  const avatarFallback = plant.is_business_listing
    ? (businessName?.[0] || plant.contact_name?.[0] || "B").toUpperCase()
    : (
        firstName?.[0] ||
        username?.[0] ||
        plant.contact_name?.[0] ||
        "U"
      ).toUpperCase();

  return (
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
      onClick={() => onViewDetails(plant.id)}
    >
      {/* Equipment Image */}
      <Box
        sx={{
          width: "100%",
          height: 200,
          backgroundColor: "grey.200",
          backgroundImage: plant.images?.[0]
            ? `url(${plant.images[0]})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {!plant.images?.[0] && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "grey.500",
            }}
          >
            <Icon icon="mdi:excavator" width={60} height={60} />
            <Typography variant="caption" sx={{ mt: 1 }}>
              No Image Available
            </Typography>
          </Box>
        )}
        {plant.images && plant.images.length > 1 && (
          <Chip
            label={`+${plant.images.length - 1} ${plant.images.length === 2 ? "photo" : "photos"}`}
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
        {/* Equipment Header */}
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
                {plant.title}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {plant.equipment_type}
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
            label={plant.condition}
            size="small"
            color={plant.condition === "new" ? "success" : "default"}
            sx={{ fontSize: "0.7rem", height: 20 }}
          />
          <Chip
            label={plant.category}
            size="small"
            variant="outlined"
            sx={{ fontSize: "0.7rem", height: 20 }}
          />
          {plant.is_business_listing && (
            <Chip
              label="Business"
              size="small"
              color="primary"
              variant="outlined"
              icon={<Icon icon="mdi:domain" width={14} />}
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
          )}
          {plant.delivery_available && (
            <Chip
              label="Delivery"
              size="small"
              color="success"
              variant="outlined"
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
          )}
        </Flex>

        {/* Key Details */}
        <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
          {/* Price */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
            <Box color="primary.main" sx={{ display: "flex" }}>
              <Icon icon="mdi:currency-usd" height={16} />
            </Box>
            <Typography variant="body2" fontWeight={600} color="primary.main">
              {plant.sale_price ? formatPrice(plant.sale_price) : "POA"}
            </Typography>
            <Chip
              label={plant.price_type}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.6rem", height: 18 }}
            />
          </Flex>

          {/* Location */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
            <Box color="primary.main" sx={{ display: "flex" }}>
              <Icon icon="mdi:map-marker" height={16} />
            </Box>
            <Typography variant="body2">{plant.region}</Typography>
          </Flex>

          {/* Make & Model */}
          {(plant.make || plant.model) && (
            <Flex
              alignItems="center"
              gap={1}
              sx={{ py: { xs: 0.25, md: 0.5 } }}
            >
              <Box color="primary.main" sx={{ display: "flex" }}>
                <Icon icon="mdi:wrench" height={16} />
              </Box>
              <Typography variant="body2">
                {plant.make} {plant.model}
              </Typography>
            </Flex>
          )}

          {/* Hours - FIXED: null check for hours_used */}
          {plant.hours_used !== null && plant.hours_used !== undefined && (
            <Flex
              alignItems="center"
              gap={1}
              sx={{ py: { xs: 0.25, md: 0.5 } }}
            >
              <Box color="primary.main" sx={{ display: "flex" }}>
                <Icon icon="mdi:timer" height={16} />
              </Box>
              <Typography variant="body2">
                {plant.hours_used.toLocaleString()} hours
              </Typography>
            </Flex>
          )}

          {/* Posted Date */}
          <Flex alignItems="center" gap={1} sx={{ py: { xs: 0.25, md: 0.5 } }}>
            <Box color="primary.main" sx={{ display: "flex" }}>
              <Icon icon="mdi:calendar" height={16} />
            </Box>
            <Typography variant="body2">
              Posted {getDaysAgo(plant.posted_date)}
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
            onViewDetails(plant.id);
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
        <FavouriteButton itemType="plant" itemId={plant.id} size="small" />

        {/* Share Button - FIXED: Handle null sale_price */}
        <Box onClick={(e) => e.stopPropagation()}>
          <ShareButton
            useModal={true}
            variant="text"
            buttonText="Share"
            color="success"
            shareData={{
              url: `${window.location.origin}/listings/marketplace/plant/${plant.id}`,
              title: plant.title,
              description:
                plant.description ||
                `${plant.equipment_type} for ${plant.sale_price ? formatPrice(plant.sale_price) : "POA"}`,
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
            // TODO: Open contact dialog
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
  );
};

export default PlantCard;
